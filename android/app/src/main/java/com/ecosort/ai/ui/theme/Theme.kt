package com.ecosort.ai.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = EcoGreenPrimary,
    onPrimary = EcoGreenOnPrimary,
    primaryContainer = EcoGreenContainer,
    onPrimaryContainer = EcoGreenOnContainer,
    surface = EcoSurface,
    surfaceVariant = EcoSurfaceVariant
)

@Composable
fun EcoSortAITheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
