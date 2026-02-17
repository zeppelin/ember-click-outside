import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  alert = () => {
    alert('Click outside detected!');
  };
}
