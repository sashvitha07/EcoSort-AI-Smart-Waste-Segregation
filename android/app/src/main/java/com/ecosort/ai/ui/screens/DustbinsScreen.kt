package com.ecosort.ai.ui.screens

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
            "Sensors track volume. Bins with fill level >= 85% trigger cleaning alerts for sanitation dispatch.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray
        )

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(dustbins) { bin ->
                val statusColor = when (bin.status) {
                    DustbinStatus.NORMAL -> Color(0xFF2E7D32)
                    DustbinStatus.ALMOST_FULL -> Color(0xFFF57F17)
                    DustbinStatus.CLEANING_REQUIRED -> Color(0xFFC62828)
                }

                Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
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
                                onClick = {
                                    dustbins = dustbins.map {
                                        if (it.id == bin.id) it.copy(fillLevel = 0, status = DustbinStatus.NORMAL) else it
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth().padding(top = 4.dp)
                            ) {
                                Text("Mark Cleaned & Emptied")
                            }
                        }
                    }
                }
            }
        }
    }
}
