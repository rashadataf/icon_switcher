import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';


/**
 * Optional string that identifies an alternate icon.
 * - On iOS, this must match the alternate icon name in Assets/Info.plist.
 * - On Android, map this to the alias you enable (e.g., "Red" → .MainActivityRed).
 * Passing `null` or `undefined` resets to the primary icon.
 */
export type IconName = string | null | undefined;

export interface Spec extends TurboModule {
    /**
     * Resolves with the currently active icon name, or null for the primary icon.
     * iOS: whatever UIApplication.shared.alternateIconName returns (nullable).
     * Android: the friendly name you mapped to the enabled alias, or null for primary.
     */
    getIcon(): Promise<string | null>;

    /**
     * Sets the current launcher icon.
     * @param name - icon identifier; pass null/undefined to reset to primary.
     * Resolves when the request has been dispatched to the OS.
     * On Android, some launchers update after returning to Home/app drawer.
     */
    setIcon(name?: IconName): Promise<void>;
}

// The native module must be registered as "NativeIconSwitcherModule".
export default TurboModuleRegistry.getEnforcing<Spec>('NativeIconSwitcherModule');