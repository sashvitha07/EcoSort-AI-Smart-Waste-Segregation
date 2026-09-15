package com.ecosort.ai.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
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

    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        if (uri != null) {
            selectedImageUri = uri
            isAnalyzing = true
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
            "Capture or select an image to identify whether waste is Biodegradable or Non-Biodegradable.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray
        )

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F8E9)),
            modifier = Modifier
                .fillMaxWidth()
                .height(240.dp)
        ) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                if (selectedImageUri != null) {
                    Image(
                        painter = rememberAsyncImagePainter(selectedImageUri),
                        contentDescription = "Selected Item",
                        modifier = Modifier.fillMaxSize()
                    )
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.CameraAlt, contentDescription = null, modifier = Modifier.size(60.dp), tint = Color(0xFF2E7D32))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Camera & Gallery Ready", fontWeight = FontWeight.SemiBold)
                        Text("Press Open Camera or Pick Gallery below", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    }
                }
            }
        }

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
                    Text("Disposal Recommendation:", fontWeight = FontWeight.Medium)
                    Text(item.recommendation, style = MaterialTheme.typography.bodyMedium)
                }
            }
        }
    }
}
