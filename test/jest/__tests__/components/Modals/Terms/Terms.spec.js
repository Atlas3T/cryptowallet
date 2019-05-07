/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import Terms from '@/components/Modals/Terms/TermsContent';
import TermsModal from '@/components/Modals/Terms/';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Terms modal', () => {
  let wrapper;
  let router;
  let storeMocks;

  const defaultProps = {};

  function wrapperInit(options) {
    return mount(Terms, options);
  }

  function storeInit(custom, propsData) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/6' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      parentComponent: TermsModal,
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a checkbox', () => {
    expect(wrapper.contains('.checkbox-wrapper')).toBe(true);
    expect(wrapper.text()).toMatch(wrapper.vm.$t('termsBox'));
  });

  it('goes to next setup step and closes modal when checkbox is entered', (done) => {
    wrapper.vm.$parent.$store = wrapper.vm.$store;
    wrapper.find('.q-checkbox__native').trigger('click');
    wrapper.vm.$parent.termsModalOpened = true;
    setTimeout(() => {
      expect(wrapper.vm.$parent.termsModalOpened).toBe(false);
      expect(storeMocks.actions.setTermsModalOpened.mock.calls[1][1]).toBe(false);
      expect(router.history.current.path).toBe('/setup/7');
      done();
    }, 501);
    wrapper.find('.q-checkbox__native').trigger('click');
  });
});
