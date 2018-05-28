import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    alert() {
      alert('Click outside detected!');
    }
  }
});
