package com.ecosort.ai

import android.app.Application

class EcoSortApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize logging, TFLite warm-up, and municipal sensor polling
    }
}
