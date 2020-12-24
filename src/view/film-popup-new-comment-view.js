import AbstractSmartView from './abstract-smart-view';
import {EMOJIS} from '../const';


const createEmojiInputTemplate = (emoji) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
    </label>
  `;
};

const createEmojiListInputsTemplate = () => {
  const emojiListTemplate = EMOJIS.map((emoji) => createEmojiInputTemplate(emoji)).join(``);

  return emojiListTemplate;
};

const createCommentEmojiTemplate = (emoji) => emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``;


const createFilmPopupNewCommentTemplate = (emojiTemplate, comment) => {
  const emojiListInputsTemplate = createEmojiListInputsTemplate();

  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${emojiTemplate ? emojiTemplate : ``}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment ? comment : ``}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiListInputsTemplate}
      </div>
    </div>
  `;
};

export default class FilmPopupNewCommentView extends AbstractSmartView {
  constructor() {
    super();

    this._emojiTemplate = null;
    this._comment = null;

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupNewCommentTemplate(this._emojiTemplate, this._comment);
  }


  _setInnerHandlers() {
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((item) => item.addEventListener(`change`, (evt) => {
      this._emojiTemplate = createCommentEmojiTemplate(evt.target.value);
      this.updateElement();
    }));

    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, (evt) => {
      this._comment = evt.value;
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  reset() {
    this._emojiTemplate = null;
    this._comment = null;

    this.updateElement();
  }

}
