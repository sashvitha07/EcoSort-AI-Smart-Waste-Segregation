package com.ecosort.ai.ui.screens

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
                Text("Segregation Breakdown", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total Waste Scanned: $total", fontWeight = FontWeight.SemiBold)
                    Text("Ratio: $bioPercent% / $nonBioPercent%")
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
