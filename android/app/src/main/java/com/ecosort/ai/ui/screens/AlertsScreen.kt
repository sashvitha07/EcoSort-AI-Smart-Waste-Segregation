package com.ecosort.ai.ui.screens

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
                                modifier = Modifier.fillMaxWidth().padding(top = 4.dp)
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
