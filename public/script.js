const API_URL = '/api/chat';
const REQUEST_TIMEOUT_MS = 60000;

const NO_RESULT_MESSAGE = 'Sorry, no response received.';
const REQUEST_FAILED_MESSAGE = 'Failed to get response from server.';

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitButton = chatForm.querySelector('button[type="submit"]');

// Full chat history, sent with every request so the model keeps context.
const conversation = [];

function appendMessage(sender, text) {
  const message = document.createElement('div');
  message.classList.add('message', sender);
  // textContent keeps user and model text from being rendered as HTML.
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
  return message;
}

function appendLoadingMessage() {
  const message = appendMessage('bot', '');
  message.classList.add('loading');
  message.setAttribute('aria-label', 'Loading');
  message.append(
    document.createElement('span'),
    document.createElement('span'),
    document.createElement('span')
  );
  chatBox.scrollTop = chatBox.scrollHeight;
  return message;
}

function showText(message, text) {
  message.classList.remove('loading');
  message.removeAttribute('aria-label');
  message.textContent = text;
}

function showMarkdown(message, markdown) {
  // Fall back to plain text if the CDN libraries failed to load.
  if (!window.marked || !window.DOMPurify) {
    showText(message, markdown);
    return;
  }

  message.classList.remove('loading');
  message.removeAttribute('aria-label');
  // Model output is untrusted, so sanitize it before inserting it as HTML.
  message.innerHTML = DOMPurify.sanitize(marked.parse(markdown, { breaks: true }));
}

function setPending(isPending) {
  userInput.disabled = isPending;
  submitButton.disabled = isPending;
}

async function fetchReply() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  appendMessage('user', text);
  conversation.push({ role: 'user', text });
  userInput.value = '';
  setPending(true);

  const botMessage = appendLoadingMessage();

  try {
    const reply = await fetchReply();

    if (reply) {
      showMarkdown(botMessage, reply);
      conversation.push({ role: 'model', text: reply });
    } else {
      showText(botMessage, NO_RESULT_MESSAGE);
      conversation.pop();
    }
  } catch (error) {
    console.error('Chat request failed:', error);
    showText(botMessage, REQUEST_FAILED_MESSAGE);
    conversation.pop();
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight;
    setPending(false);
    userInput.focus();
  }
});
