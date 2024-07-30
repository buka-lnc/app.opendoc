import { InjectionKey } from 'vue';
export declare const SELECT_VISIBLE_INJECT_KEY: InjectionKey<{
    visible: Ref<boolean>;
    toggleVisible: (visible?: boolean) => void;
}>;
export declare const SELECT_VALUE_INJECT_KEY: InjectionKey<Ref<string | undefined>>;
