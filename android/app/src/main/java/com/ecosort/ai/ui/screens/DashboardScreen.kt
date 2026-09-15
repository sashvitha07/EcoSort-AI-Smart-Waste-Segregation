package com.ecosort.ai.ui.screens

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
        // Hero Card
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        "EcoSort AI System Active",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1B5E20)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "Smart Waste Segregation and Monitoring System",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF2E7D32)
                    )
                }
            }
        }

        // Metrics Grid: Total Waste Scanned: 129, Biodegradable: 76, Non-Biodegradable: 53, Active Alerts: 1
        item {
            Text("Dashboard Overview", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
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
