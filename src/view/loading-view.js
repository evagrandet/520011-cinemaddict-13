import AbstractView from "./abstract-view";

const createLoadingTemplate = () => {
  return `<section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>`;
};

export default class LoadingView extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
