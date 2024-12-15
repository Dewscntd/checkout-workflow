import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';

export interface BaseState {
  loading: Record<string, boolean>;
  error: string | null;
}

type StateUpdater<T> = (state: T) => Partial<T>;

export abstract class BaseStore<T extends BaseState> {
  private updaterSubject = new Subject<StateUpdater<T>>();
  private stateSubject: BehaviorSubject<T>;

  state$: Observable<T>;

  constructor(initialState: T) {
    this.stateSubject = new BehaviorSubject<T>(initialState);

    this.state$ = this.updaterSubject.asObservable().pipe(
      scan((state, updater) => ({ ...state, ...updater(state) }), initialState),
      shareReplay({ bufferSize: 1, refCount: true })
    );
    this.state$.subscribe((newState) => this.stateSubject.next(newState));
  }

  get currentState(): T {
    return this.stateSubject.value;
  }

  public updateState(updater: Partial<T> | StateUpdater<T>): void {
    if (typeof updater === 'function') {
      this.updaterSubject.next(updater as StateUpdater<T>);
    } else {
      this.updaterSubject.next((state: T) => ({ ...state, ...updater }));
    }
  }

public apiProcedure<R>(
  key: string,
  procedure: Observable<R>,
  onSuccess: (result: R, state: T) => Partial<T>,
  onError?: (error: Error, state: T) => Partial<T>
): void {
  this.updateState((state: T): Partial<T> => ({
    loading: { ...state.loading, [key]: true },
    error: null,
  }) as Partial<T>);

  procedure.subscribe({
    next: (result) => {
      this.updateState((state: T): Partial<T> => {
        const newState = onSuccess(result, state);
        return { ...newState, loading: { ...state.loading, [key]: false } } as Partial<T>;
      });
    },
    error: (err: Error) => {
      this.updateState((state: T): Partial<T> => {
        const newState = onError
          ? onError(err, state)
          : { error: err.message || 'An error occurred.' };
        return { ...newState, loading: { ...state.loading, [key]: false } } as Partial<T>;
      });
    },
  });
}

}
