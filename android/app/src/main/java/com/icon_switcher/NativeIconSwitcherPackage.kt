package com.icon_switcher

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeIconSwitcherPackage : BaseReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
        if (name == NativeIconSwitcherModule.NAME) {
            NativeIconSwitcherModule(reactContext)
        } else {
            null
        }

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            NativeIconSwitcherModule.NAME to ReactModuleInfo(
                name = NativeIconSwitcherModule.NAME,
                className = NativeIconSwitcherModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}