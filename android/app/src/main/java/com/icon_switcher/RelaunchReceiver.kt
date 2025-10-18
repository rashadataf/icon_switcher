package com.icon_switcher

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class RelaunchReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        val pkg = context.packageName
        val launchIntent = context.packageManager.getLaunchIntentForPackage(pkg)?.apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(launchIntent)
    }
}
