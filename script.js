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
  var stickerMap = {
    thanks: {
      label: "感謝",
      legacy: "🙏",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#fff3c7"/><path d="M28 49c-8-8-9-19-3-27 5 9 10 15 17 20" fill="none" stroke="#bd7b34" stroke-width="8" stroke-linecap="round"/><path d="M68 49c8-8 9-19 3-27-5 9-10 15-17 20" fill="none" stroke="#bd7b34" stroke-width="8" stroke-linecap="round"/><path d="M36 50h24" stroke="#d99a8e" stroke-width="7" stroke-linecap="round"/></svg>'
    },
    cheer: {
      label: "慶祝",
      legacy: "🎉",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#ffe4dc"/><path d="M30 54l12-38 26 26z" fill="#f4b84e" stroke="#9f6b33" stroke-width="4" stroke-linejoin="round"/><circle cx="65" cy="18" r="5" fill="#d95f78"/><circle cx="75" cy="33" r="4" fill="#5aa28f"/><path d="M25 17c10 2 12 7 9 15M57 15c-8 4-10 9-8 15" fill="none" stroke="#6e8ec8" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    flower: {
      label: "花開",
      legacy: "🌸",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#fff1f7"/><g fill="#f4abc8" stroke="#cb6f90" stroke-width="3"><ellipse cx="48" cy="22" rx="10" ry="17"/><ellipse cx="48" cy="50" rx="10" ry="17"/><ellipse cx="32" cy="36" rx="17" ry="10"/><ellipse cx="64" cy="36" rx="17" ry="10"/></g><circle cx="48" cy="36" r="8" fill="#f5cf63"/></svg>'
    },
    tea: {
      label: "好茶",
      legacy: "☕",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#edf8ee"/><path d="M28 31h34v10c0 10-7 17-17 17s-17-7-17-17z" fill="#fffaf1" stroke="#446f68" stroke-width="5"/><path d="M62 35h6c6 0 6 11 0 11h-6" fill="none" stroke="#446f68" stroke-width="5"/><path d="M32 25h26" stroke="#b1843f" stroke-width="5" stroke-linecap="round"/><path d="M38 15c-5 5 3 7-2 12M50 13c-5 5 3 7-2 12" fill="none" stroke="#7fae9a" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    smile: {
      label: "微笑",
      legacy: "😊",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#fff0ad"/><circle cx="48" cy="36" r="24" fill="#ffd865" stroke="#b1843f" stroke-width="4"/><circle cx="39" cy="30" r="4" fill="#4c4031"/><circle cx="57" cy="30" r="4" fill="#4c4031"/><path d="M36 42c7 8 17 8 24 0" fill="none" stroke="#4c4031" stroke-width="5" stroke-linecap="round"/></svg>'
    },
    heart: {
      label: "祝福",
      legacy: "💛",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#ffe8ee"/><path d="M48 56S24 43 24 27c0-9 11-15 24-2 13-13 24-7 24 2 0 16-24 29-24 29z" fill="#f2c84b" stroke="#bd8a2d" stroke-width="4" stroke-linejoin="round"/></svg>'
    },
    sparkle: {
      label: "閃耀",
      legacy: "✨",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#eef5ff"/><path d="M48 12l7 17 17 7-17 7-7 17-7-17-17-7 17-7z" fill="#f7cf59" stroke="#6e8ec8" stroke-width="4" stroke-linejoin="round"/><path d="M72 14l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#ffffff" stroke="#6e8ec8" stroke-width="3"/></svg>'
    },
    green: {
      label: "自在",
      legacy: "🌿",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72"><rect width="96" height="72" rx="24" fill="#effbef"/><path d="M30 56c18-7 30-20 38-39" fill="none" stroke="#446f68" stroke-width="5" stroke-linecap="round"/><path d="M42 42c-14 2-20-8-18-18 13-1 22 6 18 18zM58 32c-5-13 3-22 14-23 5 12-1 22-14 23z" fill="#8bcf9a" stroke="#446f68" stroke-width="4" stroke-linejoin="round"/></svg>'
    }
  };

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

  function findLegacySticker(text, index) {
    var keys = Object.keys(stickerMap);

    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var legacy = stickerMap[key].legacy;
      if (legacy && text.slice(index, index + legacy.length) === legacy) {
        return {
          key: key,
          length: legacy.length
        };
      }
    }

    return null;
  }

  function appendSticker(parent, key) {
    var sticker = stickerMap[key];
    if (!sticker) return false;

    var element = document.createElement("span");
    element.className = "message-sticker sticker-" + key;
    element.setAttribute("aria-label", sticker.label + "貼圖");
    element.appendChild(createStickerImage(sticker));
    parent.appendChild(element);
    return true;
  }

  function createStickerImage(sticker) {
    var image = document.createElement("img");
    image.className = "sticker-image";
    image.alt = sticker.label + "貼圖";
    image.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(sticker.svg);
    image.draggable = false;
    return image;
  }

  function renderStickerButtons() {
    Object.keys(stickerMap).forEach(function (key) {
      var button = emojiPanel.querySelector('[data-sticker="' + key + '"]');
      if (!button) return;

      button.innerHTML = "";
      button.setAttribute("aria-label", stickerMap[key].label + "貼圖");
      button.appendChild(createStickerImage(stickerMap[key]));
    });
  }

  function renderMessageContent(parent, value) {
    var text = String(value || "");
    var tokenPattern = /\[\[sticker:([a-z]+)\]\]/g;
    var cursor = 0;
    var match;

    function appendTextSegment(segment) {
      var index = 0;
      while (index < segment.length) {
        var legacy = findLegacySticker(segment, index);
        if (legacy) {
          appendSticker(parent, legacy.key);
          index += legacy.length;
          continue;
        }

        var nextStickerIndex = segment.length;
        Object.keys(stickerMap).forEach(function (key) {
          var legacyText = stickerMap[key].legacy;
          var foundIndex = legacyText ? segment.indexOf(legacyText, index) : -1;
          if (foundIndex >= 0 && foundIndex < nextStickerIndex) {
            nextStickerIndex = foundIndex;
          }
        });
        parent.appendChild(document.createTextNode(segment.slice(index, nextStickerIndex)));
        index = nextStickerIndex;
      }
    }

    while ((match = tokenPattern.exec(text)) !== null) {
      appendTextSegment(text.slice(cursor, match.index));
      if (!appendSticker(parent, match[1])) {
        parent.appendChild(document.createTextNode(match[0]));
      }
      cursor = match.index + match[0].length;
    }

    appendTextSegment(text.slice(cursor));
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
      renderMessageContent(text, message.text);

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

  function insertSticker(stickerKey) {
    if (!stickerMap[stickerKey]) return;

    var token = "[[sticker:" + stickerKey + "]]";
    var start = messageInput.selectionStart || messageInput.value.length;
    var end = messageInput.selectionEnd || start;
    var nextValue = messageInput.value.slice(0, start) + token + messageInput.value.slice(end);

    messageInput.value = nextValue.slice(0, 110);
    var nextCursor = Math.min(start + token.length, messageInput.value.length);
    messageInput.focus();
    if (messageInput.setSelectionRange) {
      messageInput.setSelectionRange(nextCursor, nextCursor);
    }
  }

  var messages = loadMessages();
  renderStickerButtons();
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
    var button = event.target.closest(".sticker-button");
    if (!button) return;

    insertSticker(button.dataset.sticker || "");
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
