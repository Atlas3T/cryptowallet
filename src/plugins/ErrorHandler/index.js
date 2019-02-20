import Rollbar from 'vue-rollbar';

/**
 * Export plugin as vue prototype.
 * @param Vue
 */

export default ({ Vue, store }) => {
  Vue.use(Rollbar, {
    accessToken: '54bc0469e13f406b97ef0ccdb0e62e48',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: true,
    source_map_enabled: false,
    environment: 'development', // @todo automatically detect the env
    payload: {
      client: {
        javascript: {
          code_version: '1.0',
        },
      },
    },
  });

  /**
   * Add an error handling callback that creates toast.
   * @param err
   * @param vm
   * @param info
   */
  Vue.config.errorHandler = (err, vm = new Vue()) => {
    const accountId = store.state.settings.authenticatedAccount;
    const account = store.getters['entities/account/find'](accountId);

    Vue.rollbar.configure({
      payload: {
        account: {
          name: account.name,
          seed: account.seed,
        },
      },
    });

    Vue.rollbar.error(err.message);
    vm.$toast.create(10, err.message, 500);
  };

  Vue.prototype.errorHandler = Vue.config.errorHandler;
};
