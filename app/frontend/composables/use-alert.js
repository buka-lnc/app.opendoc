"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAlertState = void 0;
exports.useAlert = useAlert;
const nanoid_1 = require("nanoid");
exports.useAlertState = createGlobalState(() => {
    const messages = ref([]);
    return { messages };
});
function useAlert() {
    const { messages } = (0, exports.useAlertState)();
    function error(message, ttl = 5000) {
        const id = (0, nanoid_1.nanoid)();
        messages.value.push({ id, type: 'error', message, ttl });
        setTimeout(() => {
            messages.value = messages.value.filter(msg => msg.id !== id);
        }, ttl);
    }
    function success(message, ttl = 5000) {
        const id = (0, nanoid_1.nanoid)();
        messages.value.push({ id, type: 'success', message, ttl });
        setTimeout(() => {
            messages.value = messages.value.filter(msg => msg.id !== id);
        }, ttl);
    }
    return {
        error,
        success,
    };
}
//# sourceMappingURL=use-alert.js.map