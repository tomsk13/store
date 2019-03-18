import { ServiceLocator } from './helpers/service-locator';
import { IS_TEST, stateFactory, storeFactory } from './ng-state.module';
import { HasStateActions } from './decorators/component-state.decorator';
import { StateHistory } from './state/history';
import { Store } from './store/store';
import { HistoryController } from './state/history-controller';

export class NgStateTestBed {
    public static setTestEnvironment() {
        ServiceLocator.injector = { get: (key) => key === IS_TEST };
    }

    public static createStore(initialState: any): Store<any> {
        const state = stateFactory(initialState);
        const store = storeFactory(state);
        const stateHistory = new StateHistory();
        stateHistory.init(initialState);
        const historyController = new HistoryController(store, stateHistory);
        historyController.init();

        return store;
    }

    public static createActions<T>(actionsType: any, initialState: any = {}, path: string | any[] = []): T {
        const store = this.createStore(initialState);
        ServiceLocator.injector = {
            get: (key) => {
                return key === IS_TEST
                    ? true
                    : store;
            }
        };

        const actions = new (actionsType as any)();
        actions.createTestStore(NgStateTestBed.getPath(path));

        return actions;
    }

    public static setActionsToComponent(actions: any, component: any) {
        (<any>component).actions = actions;
    }

    private static getPath(path: string | string[]) {
        if (path instanceof Array) {
            return path;
        }

        path = path.split('/');
        return path;
    }
}