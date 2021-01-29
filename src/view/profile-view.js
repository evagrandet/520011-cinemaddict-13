import AbstractSmartView from './abstract-smart-view';
import {getUserRank} from '../utils/common';

const createProfileTemplate = (userRank) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProfileView extends AbstractSmartView {
  constructor() {
    super();
    this._userRank = ``;
  }

  getTemplate() {
    return createProfileTemplate(this._userRank);
  }

  setRank(films) {
    this._userRank = getUserRank(films);
    this.updateElement();
  }

  restoreHandlers() {}

}
