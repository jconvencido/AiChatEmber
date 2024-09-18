import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'aidev/config/environment'
import { GoogleGenerativeAI } from '@google/generative-ai'


export default class UserInputComponent extends Component {
  @tracked userInput = '';
  @tracked responseMessage = '';
  @tracked isLoading = false;

  getConversationBox() {
    return document.querySelector('.conversation-box');
  }

  createNewp(message, pov) {
    var newp = document.createElement('p');
    newp.className = pov == 'user' ? 'response-user':'response-ai';
    newp.innerHTML = message;
    return newp;
  }

  clearForm() {
    document.querySelector('.chat-input').value = '';
  }

  // Update user input
  @action
  updateInput(event) {
    this.userInput = event.target.value;
  }

  // Handle form submission
  @action
  async submitForm(event) {
    event.preventDefault();
    this.clearForm();

    const genAI = new GoogleGenerativeAI(ENV.ai_key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = this.userInput;
    let conversationBox = this.getConversationBox();

    if(conversationBox) {
      conversationBox.appendChild(this.createNewp(this.userInput, 'user'));
    }

    this.isLoading = true; // Show loading state

    try {
      const result = await model.generateContent(prompt);
      this.responseMessage = result.response.text();
    } catch (error) {
      this.responseMessage = "Error occurred while fetching the response.";
    }

    if(conversationBox) {
      conversationBox.appendChild(this.createNewp(this.responseMessage, 'Ai'));
    }

    this.isLoading = false;
  }
}

