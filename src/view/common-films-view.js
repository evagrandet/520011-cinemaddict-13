import AbstractView from './abstract-view';

const createCommonFilmsTemplate = () => {
  return `<section class="films">
    <section class="films-list">

    </section>
  </section>`;
};

export default class CommonFilmsView extends AbstractView {

  getTemplate() {
    return createCommonFilmsTemplate();
  }

}
