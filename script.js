(function () {
  var storageKey = "retirementBlessingsForChiefOnlyV1";
  var cloudEndpoint = "https://script.google.com/macros/s/AKfycbwA_ZfzWR_gpDQKliTPC-YQSiodh49JBd2T2RSqVLyQKd0PAt29jsjN0a81G7v59UMg/exec";
  var messagesGrid = document.getElementById("messagesGrid");
  var messageForm = document.getElementById("messageForm");
  var nameInput = document.getElementById("nameInput");
  var messageInput = document.getElementById("messageInput");
  var copyLinkButton = document.getElementById("copyLinkButton");
  var exportButton = document.getElementById("exportButton");
  var importInput = document.getElementById("importInput");
  var emojiPanel = document.getElementById("emojiPanel");
  var shareOutput = document.getElementById("shareOutput");
  var submitButton = messageForm.querySelector(".primary-button");
  var editIndex = -1;
  var cancelEditButton = document.createElement("button");

  cancelEditButton.className = "ghost-button";
  cancelEditButton.hidden = true;
  cancelEditButton.textContent = "取消編輯";
  cancelEditButton.type = "button";
  submitButton.insertAdjacentElement("afterend", cancelEditButton);

  function encodeMessages(messages) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(messages))));
  }

  function decodeMessages(value) {
    try {
      var json = decodeURIComponent(escape(atob(value)));
      var parsed = JSON.parse(json);
      return Array.isArray(parsed) ? sanitizeMessages(parsed) : null;
    } catch (error) {
      return null;
    }
  }

  function sanitizeMessages(items) {
    return items
      .filter(function (item) {
        return item && typeof item.text === "string" && item.text.trim();
      })
      .slice(0, 100)
      .map(function (item) {
        return {
          row: Number(item.row) || 0,
          name: String(item.name || "匿名祝福").trim().slice(0, 16),
          text: String(item.text).trim().slice(0, 110)
        };
      });
  }

  function readHashMessages() {
    var match = window.location.hash.match(/messages=([^&]+)/);
    return match ? decodeMessages(match[1]) : null;
  }

  function loadMessages() {
    var hashMessages = readHashMessages();
    if (hashMessages && hashMessages.length) {
      localStorage.setItem(storageKey, JSON.stringify(hashMessages));
      return hashMessages;
    }

    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      return Array.isArray(saved) ? sanitizeMessages(saved) : [];
    } catch (error) {
      return [];
    }
  }

  function saveMessages(messages) {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }

  function cloudRequest(params) {
    return new Promise(function (resolve, reject) {
      if (!cloudEndpoint) {
        reject(new Error("cloud endpoint is not configured"));
        return;
      }

      var callbackName = "chiefBlessingCallback" + Date.now() + Math.floor(Math.random() * 10000);
      var script = document.createElement("script");
      var timeout = setTimeout(function () {
        cleanup();
        reject(new Error("cloud request timed out"));
      }, 12000);

      function cleanup() {
        clearTimeout(timeout);
        try {
          delete window[callbackName];
        } catch (error) {
          window[callbackName] = undefined;
        }
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }

      window[callbackName] = function (payload) {
        cleanup();
        if (payload && payload.ok) {
          resolve(payload);
          return;
        }
        reject(new Error(payload && payload.error ? payload.error : "cloud request failed"));
      };

      params.callback = callbackName;
      params.cache = String(Date.now());
      script.src = cloudEndpoint + "?" + new URLSearchParams(params).toString();
      script.onerror = function () {
        cleanup();
        reject(new Error("cloud request failed"));
      };
      document.body.appendChild(script);
    });
  }

  function loadCloudMessages() {
    return cloudRequest({ action: "list" }).then(function (payload) {
      return sanitizeMessages(payload.messages || []);
    });
  }

  function saveCloudMessages(message, currentMessage) {
    var params = {
      action: currentMessage && currentMessage.row ? "update" : "add",
      name: message.name,
      text: message.text
    };

    if (currentMessage && currentMessage.row) {
      params.row = String(currentMessage.row);
    }

    return cloudRequest(params).then(function (payload) {
      return sanitizeMessages(payload.messages || []);
    });
  }

  function renderMessages(messages) {
    messagesGrid.innerHTML = "";

    if (!messages.length) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "目前還沒有祝福，先寫下第一句話。";
      messagesGrid.appendChild(empty);
      return;
    }

    messages.forEach(function (message, index) {
      var card = document.createElement("article");
      card.className = "message-card";

      var text = document.createElement("p");
      text.textContent = message.text;

      var name = document.createElement("strong");
      name.textContent = "— " + (message.name || "匿名祝福");

      var actions = document.createElement("div");
      actions.className = "message-actions";

      var editButton = document.createElement("button");
      editButton.className = "edit-message-button";
      editButton.dataset.index = String(index);
      editButton.textContent = "編輯";
      editButton.type = "button";

      actions.appendChild(editButton);
      card.appendChild(text);
      card.appendChild(name);
      card.appendChild(actions);
      messagesGrid.appendChild(card);
    });
  }

  function resetEditMode() {
    editIndex = -1;
    submitButton.textContent = "送出祝福";
    cancelEditButton.hidden = true;
  }

  function clearForm() {
    nameInput.value = "";
    messageInput.value = "";
    resetEditMode();
  }

  function startEdit(index) {
    var message = messages[index];
    if (!message) return;

    editIndex = index;
    nameInput.value = message.name || "";
    messageInput.value = message.text || "";
    submitButton.textContent = "儲存編輯";
    cancelEditButton.hidden = false;
    shareOutput.textContent = "正在編輯一則祝福。";
    messageInput.focus();
  }

  function makeShareUrl() {
    return window.location.href.split("#")[0];
  }

  function showManualCopy(url) {
    shareOutput.innerHTML = "";
    var note = document.createElement("div");
    note.textContent = "如果瀏覽器無法自動複製，請手動複製以下連結：";
    var textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.rows = 3;
    shareOutput.appendChild(note);
    shareOutput.appendChild(textarea);
    textarea.select();
  }

  function insertEmoji(emoji) {
    var start = messageInput.selectionStart || messageInput.value.length;
    var end = messageInput.selectionEnd || start;
    var nextValue = messageInput.value.slice(0, start) + emoji + messageInput.value.slice(end);

    messageInput.value = nextValue.slice(0, 110);
    var nextCursor = Math.min(start + emoji.length, messageInput.value.length);
    messageInput.focus();
    if (messageInput.setSelectionRange) {
      messageInput.setSelectionRange(nextCursor, nextCursor);
    }
  }

  var messages = loadMessages();
  renderMessages(messages);

  loadCloudMessages().then(function (cloudMessages) {
    messages = cloudMessages;
    saveMessages(messages);
    renderMessages(messages);
    shareOutput.textContent = "";
  }).catch(function () {
    shareOutput.textContent = "目前使用此裝置暫存資料，雲端祝福稍後再試。";
  });

  messageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var text = messageInput.value.trim();
    if (!text) return;

    var nextMessage = {
      name: nameInput.value.trim() || "匿名祝福",
      text: text
    };

    submitButton.disabled = true;
    shareOutput.textContent = "正在送出祝福...";

    var wasEditing = editIndex >= 0;

    saveCloudMessages(nextMessage, messages[editIndex]).then(function (cloudMessages) {
      messages = cloudMessages;
      saveMessages(messages);
      renderMessages(messages);
      clearForm();
      shareOutput.textContent = wasEditing ? "祝福已更新，手機與電腦都會同步顯示。" : "祝福已送出，手機與電腦都會同步顯示。";
    }).catch(function () {
      if (editIndex >= 0 && messages[editIndex]) {
        messages[editIndex] = nextMessage;
        shareOutput.textContent = "雲端暫時無法連線，已先存在此裝置。";
      } else {
        messages.unshift(nextMessage);
        shareOutput.textContent = "雲端暫時無法連線，已先存在此裝置。";
      }

      messages = sanitizeMessages(messages);
      saveMessages(messages);
      renderMessages(messages);
      clearForm();
    }).finally(function () {
      submitButton.disabled = false;
    });
  });

  messagesGrid.addEventListener("click", function (event) {
    var button = event.target.closest(".edit-message-button");
    if (!button) return;

    startEdit(Number(button.dataset.index));
  });

  cancelEditButton.addEventListener("click", function () {
    clearForm();
    shareOutput.textContent = "已取消編輯。";
  });

  emojiPanel.addEventListener("click", function (event) {
    var button = event.target.closest(".emoji-button");
    if (!button) return;

    insertEmoji(button.dataset.emoji || "");
  });

  copyLinkButton.addEventListener("click", function () {
    var url = makeShareUrl();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(function () {
        shareOutput.textContent = "分享連結已複製。";
      }).catch(function () {
        showManualCopy(url);
      });
      return;
    }

    showManualCopy(url);
  });

  exportButton.addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: "application/json"
    });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "retirement-blessings.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });

  importInput.addEventListener("change", function () {
    var file = importInput.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function () {
      try {
        var imported = sanitizeMessages(JSON.parse(reader.result));
        messages = sanitizeMessages(imported.concat(messages));
        saveMessages(messages);
        renderMessages(messages);
        shareOutput.textContent = "祝福已匯入此裝置；新的祝福會從雲端同步。";
      } catch (error) {
        shareOutput.textContent = "匯入檔案格式不正確，請選擇 JSON 檔。";
      }
      importInput.value = "";
    };
    reader.readAsText(file);
  });
})();
