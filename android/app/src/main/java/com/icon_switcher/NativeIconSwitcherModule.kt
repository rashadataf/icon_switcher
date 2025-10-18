package com.icon_switcher

import android.app.Activity
import android.app.Application
import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class NativeIconSwitcherModule(private val ctx: ReactApplicationContext) :
    NativeIconSwitcherModuleSpec(ctx) {

    override fun getName() = "NativeIconSwitcherModule"

    private val pm get() = ctx.packageManager
    private val pkg get() = ctx.packageName

    private val primary = "MainActivityPrimary"
    private val alt = "MainActivityAlt"

    // We postpone disabling this alias until the app backgrounds
    private val handler = Handler(Looper.getMainLooper())

    override fun getIcon(promise: Promise) {
        try {
            val p = ComponentName(pkg, "$pkg.$primary")
            val a = ComponentName(pkg, "$pkg.$alt")
            val pEnabled = isEnabled(p, defaultEnabled = true)
            val aEnabled = isEnabled(a, defaultEnabled = false)
            promise.resolve(if (aEnabled && !pEnabled) "alt" else null)
        } catch (e: Exception) {
            promise.reject("E_GET_ICON", e)
        }
    }

    override fun setIcon(name: String?, promise: Promise) {
        try {
            val targetIcon = if ((name ?: "primary").equals("alt", ignoreCase = true)) "alt" else "primary"
            val targetAlias = if (targetIcon == "alt") alt else primary
            val otherAlias = if (targetAlias == primary) alt else primary

            val target = ComponentName(pkg, "$pkg.$targetAlias")
            val other = ComponentName(pkg, "$pkg.$otherAlias")


            handler.postDelayed({
                scheduleRelaunch()
            }, 1700)

            // Enable target alias
            pm.setComponentEnabledSetting(
                target,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP
            )

            // Disable old alias
            pm.setComponentEnabledSetting(
                other,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP
            )

            promise.resolve(targetIcon)

        } catch (e: Exception) {
            promise.reject("E_SET_ICON", e)
        }
    }

    private fun scheduleRelaunch() {
        val intent = Intent(ctx, RelaunchReceiver::class.java)
        ctx.sendBroadcast(intent)
    }



    // ---------- helpers ----------

    private fun isEnabled(cn: ComponentName, defaultEnabled: Boolean): Boolean {
        return when (pm.getComponentEnabledSetting(cn)) {
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED -> true
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED -> false
            PackageManager.COMPONENT_ENABLED_STATE_DEFAULT -> defaultEnabled
            else -> defaultEnabled
        }
    }

    companion object {
        const val NAME = "NativeIconSwitcherModule"
    }
}
