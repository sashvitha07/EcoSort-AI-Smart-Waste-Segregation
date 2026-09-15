export interface SourceFile {
  name: string;
  path: string;
  language: string;
  category: 'build' | 'manifest' | 'navigation' | 'screens' | 'ml' | 'data' | 'theme';
  code: string;
  description: string;
}

export const ANDROID_SOURCE_FILES: SourceFile[] = [
  {
    name: 'build.gradle.kts (Project)',
    path: 'build.gradle.kts',
    language: 'kotlin',
    category: 'build',
    description: 'Root project build configuration with Kotlin 2.0 & Android Gradle Plugin',
    code: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`,
  },
  {
    name: 'app/build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    category: 'build',
    description: 'App-level dependencies: Jetpack Compose, CameraX, TensorFlow Lite, Play Services Location',
    code: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.ecosort.ai"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.ecosort.ai"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        mlModelBinding = true
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.activity:activity-compose:1.10.1")

    // Jetpack Compose BOM & Material 3
    implementation(platform("androidx.compose:compose-bom:2025.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.8.7")

    // CameraX for Real-Time Waste Scanning
    val cameraxVersion = "1.4.1"
    implementation("androidx.camera:camera-core:$cameraxVersion")
    implementation("androidx.camera:camera-camera2:$cameraxVersion")
    implementation("androidx.camera:camera-lifecycle:$cameraxVersion")
    implementation("androidx.camera:camera-view:$cameraxVersion")

    // Google Play Services for Remote GPS Geolocation
    implementation("com.google.android.gms:play-services-location:21.3.0")

    // TensorFlow Lite for Edge Waste Classification
    implementation("org.tensorflow:tensorflow-lite:2.14.0")
    implementation("org.tensorflow:tensorflow-lite-support:0.4.4")
    implementation("org.tensorflow:tensorflow-lite-metadata:0.4.4")

    // Image loading
    implementation("io.coil-kt:coil-compose:2.7.0")

    // Permissions handling
    implementation("com.google.accompanist:accompanist-permissions:0.37.0")

    // Tooling & Debugging
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`,
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    category: 'manifest',
    description: 'Permissions for Camera, GPS Geolocation, and Media Gallery access',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Camera Permission for Waste Scanning -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature
        android:name="android.hardware.camera"
        android:required="false" />

    <!-- Precise GPS Location for Remote Areas (Beaches, Forests) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <!-- Gallery & Storage Access -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission 
        android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />

    <!-- Network for Cloud Sync / Alerts -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:name=".EcoSortApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.EcoSortAI">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.EcoSortAI"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`,
  },
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/ecosort/ai/MainActivity.kt',
    language: 'kotlin',
    category: 'screens',
    description: 'Entry Activity hosting Compose theme and Navigation container',
    code: `package com.ecosort.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.ecosort.ai.navigation.EcoSortNavHost
import com.ecosort.ai.ui.theme.EcoSortAITheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            EcoSortAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    EcoSortNavHost()
                }
            }
        }
    }
}
`,
  },
  {
    name: 'WasteModels.kt',
    path: 'app/src/main/java/com/ecosort/ai/data/WasteModels.kt',
    language: 'kotlin',
    category: 'data',
    description: 'Core Domain models for waste categories, dustbins, alerts, and remote surveys',
    code: `package com.ecosort.ai.data

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
`,
  },
  {
    name: 'WasteClassifier.kt (TFLite)',
    path: 'app/src/main/java/com/ecosort/ai/ml/WasteClassifier.kt',
    language: 'kotlin',
    category: 'ml',
    description: 'TensorFlow Lite waste classifier pipeline with 2-class output and demo fallback',
    code: `package com.ecosort.ai.ml

import android.content.Context
import android.graphics.Bitmap
import com.ecosort.ai.data.WasteCategory
import com.ecosort.ai.data.WasteClassificationResult
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.channels.FileChannel

/**
 * WasteClassifier handles on-device inference using TensorFlow Lite.
 * Classifies waste images into exactly two categories:
 * - Biodegradable (food scraps, vegetable waste, paper, cardboard)
 * - Non-Biodegradable (plastic bottles, covers, cans, metal)
 */
class WasteClassifier(private val context: Context) {

    private var tfliteInterpreter: Interpreter? = null
    private val modelInputSize = 224 // standard MobileNet/EfficientNet input

    init {
        loadModelIfAvailable()
    }

    private fun loadModelIfAvailable() {
        try {
            val assetFileDescriptor = context.assets.openFd("ecosort_model.tflite")
            val inputStream = FileInputStream(assetFileDescriptor.fileDescriptor)
            val fileChannel = inputStream.channel
            val startOffset = assetFileDescriptor.startOffset
            val declaredLength = assetFileDescriptor.declaredLength
            val modelBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
            tfliteInterpreter = Interpreter(modelBuffer)
        } catch (e: Exception) {
            // Model file not bundled yet; graceful fallback for demo mode
            tfliteInterpreter = null
        }
    }

    /**
     * Classifies a bitmap image into Biodegradable or Non-Biodegradable.
     */
    fun classify(bitmap: Bitmap): WasteClassificationResult {
        if (tfliteInterpreter != null) {
            return runInference(bitmap)
        }
        // Demo fallback simulating intelligent edge detection
        return generateDemoClassification(bitmap)
    }

    private fun runInference(bitmap: Bitmap): WasteClassificationResult {
        val resized = Bitmap.createScaledBitmap(bitmap, modelInputSize, modelInputSize, true)
        val byteBuffer = ByteBuffer.allocateDirect(4 * modelInputSize * modelInputSize * 3)
        byteBuffer.order(ByteOrder.nativeOrder())

        val intValues = IntArray(modelInputSize * modelInputSize)
        resized.getPixels(intValues, 0, modelInputSize, 0, 0, modelInputSize, modelInputSize)

        var pixel = 0
        for (i in 0 until modelInputSize) {
            for (j in 0 until modelInputSize) {
                val value = intValues[pixel++]
                byteBuffer.putFloat(((value shr 16 and 0xFF) - 127.5f) / 127.5f)
                byteBuffer.putFloat(((value shr 8 and 0xFF) - 127.5f) / 127.5f)
                byteBuffer.putFloat(((value and 0xFF) - 127.5f) / 127.5f)
            }
        }

        // 2-class probability output: [Biodegradable, Non-Biodegradable]
        val output = Array(1) { FloatArray(2) }
        tfliteInterpreter?.run(byteBuffer, output)

        val bioProb = output[0][0]
        val nonBioProb = output[0][1]

        return if (bioProb >= nonBioProb) {
            WasteClassificationResult(
                detectedItem = "Organic/Biodegradable Waste",
                category = WasteCategory.BIODEGRADABLE,
                confidencePercentage = bioProb * 100f,
                recommendation = "Deposit into Green Organic Bin for composting.",
                decompositionTime = "2 to 6 weeks"
            )
        } else {
            WasteClassificationResult(
                detectedItem = "Recyclable Polymer/Synthetic Waste",
                category = WasteCategory.NON_BIODEGRADABLE,
                confidencePercentage = nonBioProb * 100f,
                recommendation = "Deposit into Blue Dry Recyclable Bin.",
                decompositionTime = "200 to 500 years"
            )
        }
    }

    private fun generateDemoClassification(bitmap: Bitmap): WasteClassificationResult {
        // Deterministic demo classification based on image characteristics
        val sampleItems = listOf(
            WasteClassificationResult(
                detectedItem = "Plastic Beverage Bottle (PET)",
                category = WasteCategory.NON_BIODEGRADABLE,
                confidencePercentage = 97.4f,
                recommendation = "Rinse, flatten, and deposit in Blue Dry Recyclables bin.",
                decompositionTime = "450 years"
            ),
            WasteClassificationResult(
                detectedItem = "Vegetable Scraps & Fruit Peels",
                category = WasteCategory.BIODEGRADABLE,
                confidencePercentage = 98.1f,
                recommendation = "Deposit in Green Compost bin. Converts into fertile garden mulch.",
                decompositionTime = "3 to 4 weeks"
            ),
            WasteClassificationResult(
                detectedItem = "Crushed Aluminum Can",
                category = WasteCategory.NON_BIODEGRADABLE,
                confidencePercentage = 95.8f,
                recommendation = "100% recyclable metal. Route to scrap metal reclamation.",
                decompositionTime = "200 - 500 years"
            ),
            WasteClassificationResult(
                detectedItem = "Cardboard & Kraft Paper Box",
                category = WasteCategory.BIODEGRADABLE,
                confidencePercentage = 96.2f,
                recommendation = "Flatten and place in paper recycling or brown compost stream.",
                decompositionTime = "2 months"
            )
        )
        // Select an item deterministically from bitmap width/height hash
        val index = (bitmap.width + bitmap.height) % sampleItems.size
        return sampleItems[index]
    }
}
`,
  },
  {
    name: 'EcoSortNavigation.kt',
    path: 'app/src/main/java/com/ecosort/ai/navigation/EcoSortNavigation.kt',
    language: 'kotlin',
    category: 'navigation',
    description: 'Jetpack Compose Bottom Navigation Bar and NavHost routing',
    code: `package com.ecosort.ai.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.ecosort.ai.ui.screens.*

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Dashboard", Icons.Default.Dashboard)
    object Scan : Screen("scan", "Scan Waste", Icons.Default.QrCodeScanner)
    object Dustbins : Screen("dustbins", "Street Dustbins", Icons.Default.Delete)
    object Remote : Screen("remote", "Remote Locations", Icons.Default.LocationOn)
    object Alerts : Screen("alerts", "Alerts", Icons.Default.Notifications)
    object Reports : Screen("reports", "Reports", Icons.Default.BarChart)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EcoSortNavHost() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val screens = listOf(
        Screen.Dashboard,
        Screen.Scan,
        Screen.Dustbins,
        Screen.Remote,
        Screen.Alerts,
        Screen.Reports
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("EcoSort AI", style = MaterialTheme.typography.titleLarge) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceVariant
            ) {
                screens.forEach { screen ->
                    val isSelected = currentRoute == screen.route
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title, maxLines = 1) },
                        selected = isSelected,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Dashboard.route) {
                DashboardScreen(
                    onNavigateToScan = { navController.navigate(Screen.Scan.route) },
                    onNavigateToDustbins = { navController.navigate(Screen.Dustbins.route) }
                )
            }
            composable(Screen.Scan.route) { ScanWasteScreen() }
            composable(Screen.Dustbins.route) { DustbinsScreen() }
            composable(Screen.Remote.route) { RemoteLocationsScreen() }
            composable(Screen.Alerts.route) { AlertsScreen() }
            composable(Screen.Reports.route) { ReportsScreen() }
        }
    }
}
`,
  },
  {
    name: 'DashboardScreen.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/screens/DashboardScreen.kt',
    language: 'kotlin',
    category: 'screens',
    description: 'Dashboard displaying 129 scanned, 76 bio, 53 non-bio, 1 alert, and dustbins status',
    code: `package com.ecosort.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun DashboardScreen(
    onNavigateToScan: () -> Unit,
    onNavigateToDustbins: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Banner
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        "Smart Waste Segregation",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1B5E20)
                    )
                    Text(
                        "EcoSort AI monitors collection points, classifies waste on-device, and coordinates municipal cleanup.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF2E7D32)
                    )
                }
            }
        }

        // Metrics Grid (129 Scanned, 76 Bio, 53 Non-Bio, 1 Alert)
        item {
            Text("Overview Statistics", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                MetricCard("Total Scanned", "129", Color(0xFF2E7D32), Modifier.weight(1f))
                MetricCard("Biodegradable", "76", Color(0xFF388E3C), Modifier.weight(1f))
            }
            Spacer(modifier = Modifier.height(12.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                MetricCard("Non-Biodegradable", "53", Color(0xFFC62828), Modifier.weight(1f))
                MetricCard("Active Alerts", "1", Color(0xFFE65100), Modifier.weight(1f))
            }
        }

        // Prominent Scan CTA
        item {
            Button(
                onClick = onNavigateToScan,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32))
            ) {
                Icon(Icons.Default.QrCodeScanner, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Scan Waste with AI Camera", fontWeight = FontWeight.Bold)
            }
        }

        // Street Dustbin Status
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Street Dustbin Status", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                TextButton(onClick = onNavigateToDustbins) {
                    Text("View All")
                }
            }
            Spacer(modifier = Modifier.height(8.dp))

            DustbinMiniRow("Bin 01", "Town Square", 45, "Normal", Color(0xFF2E7D32))
            Spacer(modifier = Modifier.height(8.dp))
            DustbinMiniRow("Bin 02", "Market Crossroad", 76, "Almost Full", Color(0xFFF57F17))
            Spacer(modifier = Modifier.height(8.dp))
            DustbinMiniRow("Bin 03", "Commercial Avenue", 91, "Cleaning Required", Color(0xFFC62828))
        }

        // AI Activity
        item {
            Text("AI System Activity", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Card(shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    ActivityItem("AI Classification", "Active - MobileNet TFLite Ready", true)
                    Divider()
                    ActivityItem("Waste Monitoring", "Real-Time Sensor Polling", true)
                    Divider()
                    ActivityItem("Alert Detection", "Threshold >85% Critical Trigger", true)
                }
            }
        }
    }
}

@Composable
fun MetricCard(label: String, value: String, accentColor: Color, modifier: Modifier = Modifier) {
    Card(shape = RoundedCornerShape(12.dp), modifier = modifier) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(label, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            Spacer(modifier = Modifier.height(4.dp))
            Text(value, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = accentColor)
        }
    }
}

@Composable
fun DustbinMiniRow(binNumber: String, location: String, fillPercent: Int, status: String, color: Color) {
    Card(shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text("$binNumber • $location", fontWeight = FontWeight.SemiBold)
                Text(status, color = color, style = MaterialTheme.typography.bodySmall)
            }
            Text("$fillPercent%", fontWeight = FontWeight.Bold, color = color)
        }
    }
}

@Composable
fun ActivityItem(title: String, subtitle: String, isActive: Boolean) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(title, fontWeight = FontWeight.Medium)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        }
        Badge(containerColor = Color(0xFFE8F5E9), contentColor = Color(0xFF2E7D32)) {
            Text(if (isActive) "Active" else "Standby", modifier = Modifier.padding(4.dp))
        }
    }
}
`,
  },
  {
    name: 'ScanWasteScreen.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/screens/ScanWasteScreen.kt',
    language: 'kotlin',
    category: 'screens',
    description: 'Waste Scanner with CameraX viewfinder, Gallery photo selection, and AI classification card',
    code: `package com.ecosort.ai.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.ecosort.ai.data.WasteCategory
import com.ecosort.ai.data.WasteClassificationResult
import com.ecosort.ai.ml.WasteClassifier

@Composable
fun ScanWasteScreen() {
    val context = LocalContext.current
    val classifier = remember { WasteClassifier(context) }

    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    var isAnalyzing by remember { mutableStateOf(false) }
    var result by remember { mutableStateOf<WasteClassificationResult?>(null) }

    // Gallery Picker Launcher
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            selectedImageUri = uri
            isAnalyzing = true
            // Simulate AI Classification inference
            result = WasteClassificationResult(
                detectedItem = "Plastic Beverage Bottle (PET)",
                category = WasteCategory.NON_BIODEGRADABLE,
                confidencePercentage = 97.4f,
                recommendation = "Crush and deposit in Blue Dry Recyclables Bin.",
                decompositionTime = "450 years"
            )
            isAnalyzing = false
        }
    }

    // Camera Capture Launcher
    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap ->
        if (bitmap != null) {
            isAnalyzing = true
            result = classifier.classify(bitmap)
            isAnalyzing = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("AI Waste Classifier", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text(
            "Capture or upload an image to identify if it is Biodegradable or Non-Biodegradable.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray
        )

        // Viewfinder Area
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F8E9)),
            modifier = Modifier
                .fillMaxWidth()
                .height(260.dp)
        ) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                if (selectedImageUri != null) {
                    Image(
                        painter = rememberAsyncImagePainter(selectedImageUri),
                        contentDescription = "Scanned Waste",
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.CameraAlt, contentDescription = null, modifier = Modifier.size(64.dp), tint = Color(0xFF2E7D32))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Ready to Scan Waste", fontWeight = FontWeight.Medium)
                        Text("Place item in view and press Scan", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    }
                }
            }
        }

        // Action Buttons
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Button(
                onClick = { cameraLauncher.launch(null) },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                modifier = Modifier.weight(1f).height(48.dp)
            ) {
                Icon(Icons.Default.PhotoCamera, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Open Camera")
            }

            OutlinedButton(
                onClick = { galleryLauncher.launch("image/*") },
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.weight(1f).height(48.dp)
            ) {
                Icon(Icons.Default.PhotoLibrary, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Pick Gallery")
            }
        }

        // Analysis Result Card
        result?.let { item ->
            val isBio = item.category == WasteCategory.BIODEGRADABLE
            val categoryColor = if (isBio) Color(0xFF2E7D32) else Color(0xFFC62828)
            val bgTint = if (isBio) Color(0xFFE8F5E9) else Color(0xFFFFEBEE)

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = bgTint),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(item.category.displayName, fontWeight = FontWeight.Bold, color = categoryColor, style = MaterialTheme.typography.titleLarge)
                        Badge(containerColor = categoryColor) {
                            Text("\${item.confidencePercentage}% Confident", color = Color.White, modifier = Modifier.padding(4.dp))
                        }
                    }

                    Text("Detected: \${item.detectedItem}", fontWeight = FontWeight.SemiBold)
                    Text("Decomposition: \${item.decompositionTime}", style = MaterialTheme.typography.bodySmall)

                    Divider(color = categoryColor.copy(alpha = 0.2f))
                    Text("Disposal Instruction:", fontWeight = FontWeight.Medium)
                    Text(item.recommendation, style = MaterialTheme.typography.bodyMedium)
                }
            }
        }
    }
}
`,
  },
  {
    name: 'DustbinsScreen.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/screens/DustbinsScreen.kt',
    language: 'kotlin',
    category: 'screens',
    description: 'Street Dustbins monitor with fill level indicators (Normal, Almost Full, Cleaning Required)',
    code: `package com.ecosort.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ecosort.ai.data.DustbinStatus
import com.ecosort.ai.data.StreetDustbin

@Composable
fun DustbinsScreen() {
    var dustbins by remember {
        mutableStateOf(
            listOf(
                StreetDustbin("1", "Bin 01", "Town Square Main Park", 45, DustbinStatus.NORMAL),
                StreetDustbin("2", "Bin 02", "Market Crossroad Sector 3", 76, DustbinStatus.ALMOST_FULL),
                StreetDustbin("3", "Bin 03", "Metro North Entrance", 91, DustbinStatus.CLEANING_REQUIRED),
                StreetDustbin("4", "Bin 04", "University Gate 1", 32, DustbinStatus.NORMAL)
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Street Dustbins Monitor", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text(
            "IoT ultrasonic sensor telemetry monitors bin capacity and dispatches cleaning alerts when fill > 85%.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray
        )

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(dustbins) { bin ->
                DustbinCard(
                    bin = bin,
                    onEmptyBin = {
                        dustbins = dustbins.map {
                            if (it.id == bin.id) it.copy(fillLevel = 0, status = DustbinStatus.NORMAL) else it
                        }
                    }
                )
            }
        }
    }
}

@Composable
fun DustbinCard(bin: StreetDustbin, onEmptyBin: () -> Unit) {
    val statusColor = when (bin.status) {
        DustbinStatus.NORMAL -> Color(0xFF2E7D32)
        DustbinStatus.ALMOST_FULL -> Color(0xFFF57F17)
        DustbinStatus.CLEANING_REQUIRED -> Color(0xFFC62828)
    }

    Card(
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(bin.binNumber, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Badge(containerColor = statusColor) {
                    Text(bin.status.displayName, color = Color.White, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
            Text(bin.location, style = MaterialTheme.typography.bodySmall, color = Color.Gray)

            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Fill Level", style = MaterialTheme.typography.bodySmall)
                Text("\${bin.fillLevel}%", fontWeight = FontWeight.Bold, color = statusColor)
            }
            LinearProgressIndicator(
                progress = { bin.fillLevel / 100f },
                color = statusColor,
                trackColor = Color(0xFFE0E0E0),
                modifier = Modifier.fillMaxWidth().height(8.dp)
            )

            if (bin.status == DustbinStatus.CLEANING_REQUIRED) {
                Button(
                    onClick = onEmptyBin,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                ) {
                    Text("Mark Cleaned & Emptied")
                }
            }
        }
    }
}
`,
  },
  {
    name: 'RemoteLocationsScreen.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/screens/RemoteLocationsScreen.kt',
    language: 'kotlin',
    category: 'screens',
    description: 'Remote GPS-tagged waste surveyor for beaches, forests, and open nature trails',
    code: `package com.ecosort.ai.ui.screens

import android.Manifest
import android.annotation.SuppressLint
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material.icons.filled.PhotoCamera
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import com.google.android.gms.location.LocationServices

@OptIn(ExperimentalPermissionsApi::class)
@SuppressLint("MissingPermission")
@Composable
fun RemoteLocationsScreen() {
    val context = LocalContext.current
    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }

    var latitude by remember { mutableStateOf(13.0475) }
    var longitude by remember { mutableStateOf(80.2824) }
    var locationName by remember { mutableStateOf("Silver Beach Coastal Zone") }
    var isLocating by remember { mutableStateOf(false) }

    val permissionState = rememberMultiplePermissionsState(
        permissions = listOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.CAMERA
        )
    )

    fun fetchCurrentGps() {
        isLocating = true
        fusedLocationClient.lastLocation.addOnSuccessListener { loc ->
            if (loc != null) {
                latitude = loc.latitude
                longitude = loc.longitude
                locationName = "Surveyed Point (\${loc.latitude.toString().take(6)}, \${loc.longitude.toString().take(6)})"
            }
            isLocating = false
        }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Remote Locations Waste Survey", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text(
                "Survey open areas such as beaches, forests, and nature parks where fixed cameras cannot easily be installed.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )
        }

        // GPS Coordinates Box
        item {
            Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("GPS Geolocation", fontWeight = FontWeight.Bold)
                        IconButton(onClick = {
                            if (permissionState.allPermissionsGranted) {
                                fetchCurrentGps()
                            } else {
                                permissionState.launchMultiplePermissionRequest()
                            }
                        }) {
                            Icon(Icons.Default.GpsFixed, contentDescription = null, tint = Color(0xFF2E7D32))
                        }
                    }

                    Text("Location: $locationName", fontWeight = FontWeight.SemiBold)
                    Text("Latitude: $latitude • Longitude: $longitude", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }
            }
        }

        // Camera Scan CTA
        item {
            Button(
                onClick = { /* Launches camera with GPS metadata */ },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Icon(Icons.Default.PhotoCamera, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Scan Remote Waste with GPS")
            }
        }

        // Recent remote incident logs
        item {
            Text("Remote Incident Records", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Card(shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Marina Coastal Ridge - Sector 4", fontWeight = FontWeight.SemiBold)
                    Text("Category: Non-Biodegradable (Plastic bottles, ghost fishing net)", color = Color(0xFFC62828))
                    Text("GPS: 13.0475° N, 80.2824° E", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Action: Sanitation crew dispatched with off-road collection cart.", style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}
`,
  },
  {
    name: 'AlertsScreen.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/screens/AlertsScreen.kt',
    language: 'kotlin',
    category: 'screens',
    description: 'Active cleaning alerts, critical fill warnings, and mark as completed workflow',
    code: `package com.ecosort.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ecosort.ai.data.CleaningAlert

@Composable
fun AlertsScreen() {
    var alerts by remember {
        mutableStateOf(
            listOf(
                CleaningAlert(
                    id = "alert-01",
                    affectedTarget = "Bin 03 – Critical Fill (91%)",
                    location = "Central Commercial Market, Crossroad 7",
                    requiredAction = "Dispatch municipal cleaning truck to empty container immediately.",
                    isCritical = true,
                    isCompleted = false
                ),
                CleaningAlert(
                    id = "alert-02",
                    affectedTarget = "Silver Beach Remote Zone",
                    location = "Coastal Area Sector 4",
                    requiredAction = "Beach cleanup volunteer squad notified for plastic debris clearance.",
                    isCritical = false,
                    isCompleted = true
                )
            )
        )
    }

    val activeCount = alerts.count { !it.isCompleted }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Cleaning Alerts", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Badge(containerColor = if (activeCount > 0) Color(0xFFC62828) else Color(0xFF2E7D32)) {
                Text("$activeCount Active", color = Color.White, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
            }
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(alerts) { alert ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (alert.isCompleted) Color(0xFFF5F5F5) else Color(0xFFFFEBEE)
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(alert.affectedTarget, fontWeight = FontWeight.Bold)
                            Icon(
                                if (alert.isCompleted) Icons.Default.CheckCircle else Icons.Default.Warning,
                                contentDescription = null,
                                tint = if (alert.isCompleted) Color(0xFF2E7D32) else Color(0xFFC62828)
                            )
                        }

                        Text(alert.location, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                        Text("Action: \${alert.requiredAction}", style = MaterialTheme.typography.bodyMedium)

                        if (!alert.isCompleted) {
                            Button(
                                onClick = {
                                    alerts = alerts.map {
                                        if (it.id == alert.id) it.copy(isCompleted = true) else it
                                    }
                                },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                                modifier = Modifier.fillMaxWidth().padding(top = 6.dp)
                            ) {
                                Text("Mark Task Completed")
                            }
                        } else {
                            Text("Status: Resolved & Cleaned", color = Color(0xFF2E7D32), fontWeight = FontWeight.SemiBold, style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
        }
    }
}
`,
  },
  {
    name: 'ReportsScreen.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/screens/ReportsScreen.kt',
    language: 'kotlin',
    category: 'screens',
    description: 'Analytics reports with breakdown: Total 129, Biodegradable 76, Non-Bio 53',
    code: `package com.ecosort.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun ReportsScreen() {
    val total = 129
    val bio = 76
    val nonBio = 53
    val bioPercent = (bio.toFloat() / total * 100).toInt()
    val nonBioPercent = 100 - bioPercent

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Waste Analysis Reports", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("Aggregate segregation metrics across urban dustbins and remote camera logs.", style = MaterialTheme.typography.bodyMedium, color = Color.Gray)

        Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Segregation Ratio", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total Waste Scanned: $total", fontWeight = FontWeight.SemiBold)
                    Text("Segregation: $bioPercent% / $nonBioPercent%")
                }

                LinearProgressIndicator(
                    progress = { bio.toFloat() / total },
                    color = Color(0xFF2E7D32),
                    trackColor = Color(0xFFC62828),
                    modifier = Modifier.fillMaxWidth().height(14.dp)
                )

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Biodegradable: $bio items", color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
                    Text("Non-Biodegradable: $nonBio items", color = Color(0xFFC62828), fontWeight = FontWeight.Bold)
                }
            }
        }

        // Environmental Impact Stats
        Text("Environmental Impact", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                ImpactRow("Landfill Diversion", "64.2 kg diverted from open dumps")
                Divider()
                ImpactRow("Carbon Offset", "28.5 kg CO2 emission prevented")
                Divider()
                ImpactRow("Compost Produced", "42.8 kg organic nutrient compost")
            }
        }
    }
}

@Composable
fun ImpactRow(title: String, subtitle: String) {
    Column {
        Text(title, fontWeight = FontWeight.SemiBold)
        Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
    }
}
`,
  },
  {
    name: 'Color.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/theme/Color.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'Clean environmental green Material 3 palette',
    code: `package com.ecosort.ai.ui.theme

import androidx.compose.ui.graphics.Color

val EcoGreenPrimary = Color(0xFF2E7D32)
val EcoGreenOnPrimary = Color(0xFFFFFFFF)
val EcoGreenContainer = Color(0xFFE8F5E9)
val EcoGreenOnContainer = Color(0xFF1B5E20)

val EcoNonBioRed = Color(0xFFC62828)
val EcoWarningAmber = Color(0xFFF57F17)

val EcoSurface = Color(0xFFF9FBF8)
val EcoSurfaceVariant = Color(0xFFE0E8DC)
`,
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/ecosort/ai/ui/theme/Theme.kt',
    language: 'kotlin',
    category: 'theme',
    description: 'Material 3 theme configuration for EcoSort AI',
    code: `package com.ecosort.ai.ui.theme

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
`,
  },
];
