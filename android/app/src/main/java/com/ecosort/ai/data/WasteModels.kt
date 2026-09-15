package com.ecosort.ai.data

enum class WasteCategory(val displayName: String, val colorHex: Long) {
    BIODEGRADABLE("Biodegradable", 0xFF2E7D32),
    NON_BIODEGRADABLE("Non-Biodegradable", 0xFFC62828)
}

enum class DustbinStatus(val displayName: String) {
    NORMAL("Normal"),
    ALMOST_FULL("Almost Full"),
    CLEANING_REQUIRED("Cleaning Required")
}

data class WasteClassificationResult(
    val detectedItem: String,
    val category: WasteCategory,
    val confidencePercentage: Float, // e.g. 97.4f
    val recommendation: String,
    val decompositionTime: String
)

data class StreetDustbin(
    val id: String,
    val binNumber: String,
    val location: String,
    val fillLevel: Int, // 0 to 100
    val status: DustbinStatus
) {
    companion object {
        fun computeStatus(fillLevel: Int): DustbinStatus = when {
            fillLevel >= 85 -> DustbinStatus.CLEANING_REQUIRED
            fillLevel >= 70 -> DustbinStatus.ALMOST_FULL
            else -> DustbinStatus.NORMAL
        }
    }
}

data class RemoteLocationScan(
    val id: String,
    val detectedCategory: WasteCategory,
    val detectedItem: String,
    val latitude: Double,
    val longitude: Double,
    val areaLabel: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class CleaningAlert(
    val id: String,
    val affectedTarget: String,
    val location: String,
    val requiredAction: String,
    val isCritical: Boolean = true,
    val isCompleted: Boolean = false
)

data class WasteDashboardSummary(
    val totalScanned: Int = 129,
    val biodegradable: Int = 76,
    val nonBiodegradable: Int = 53,
    val activeAlerts: Int = 1
)
