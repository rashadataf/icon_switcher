import { useCallback, useEffect, useRef, useState } from 'react';
import IconSwitcher from '../../specs/NativeIconSwitcher';

type Options = {
    onChange?: (current: string | null) => void;
    onError?: (err: unknown) => void;
};

type UseAppIcon = {
    supported: boolean;
    current: string | null; // null = primary
    pending: boolean;
    error: unknown | null;

    refresh: () => Promise<void>;
    setIcon: (name: string | null) => Promise<void>;
    reset: () => Promise<void>;
};

export const useAppIcon = (options: Options = {}): UseAppIcon => {
    const { onChange, onError } = options;

    const [supported, setSupported] = useState<boolean>(false);
    const [current, setCurrent] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    const mounted = useRef(true);
    const inFlight = useRef(false); // simple guard against double taps

    useEffect(
        () => {
            mounted.current = true;

            // Check support.
            try {
                setSupported(IconSwitcher.isSupported());
            } catch {
                setSupported(false);
            }

            // Initial read of current icon.
            IconSwitcher.getIcon()
                .then((name) => {
                    if (mounted.current) setCurrent(name);
                })
                .catch((e) => {
                    if (mounted.current) {
                        setError(e);
                        onError?.(e);
                    }
                });

            return () => {
                mounted.current = false;
            };
        },
        [onError]
    );

    const refresh = useCallback(
        async () => {
            try {
                const name = await IconSwitcher.getIcon();
                if (mounted.current) {
                    setCurrent(name);
                    setError(null);
                }
            } catch (e) {
                if (mounted.current) {
                    setError(e);
                    onError?.(e);
                }
            }
        },
        [onError]
    );

    const setIcon = useCallback(
        async (name: string | null) => {
            if (inFlight.current) return;
            inFlight.current = true;
            setPending(true);
            setError(null);
            try {
                await IconSwitcher.setIcon(name ?? null);
                const now = await IconSwitcher.getIcon(); // read back actual state
                if (mounted.current) {
                    setCurrent(now);
                    onChange?.(now);
                }
            } catch (e) {
                if (mounted.current) {
                    setError(e);
                    onError?.(e);
                }
            } finally {
                inFlight.current = false;
                if (mounted.current) setPending(false);
            }
        },
        [onChange, onError],
    );

    const reset = useCallback(() => setIcon(null), [setIcon]);

    return { supported, current, pending, error, refresh, setIcon, reset };
};
