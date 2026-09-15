package com.ecosort.ai.ui.screens

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

    val permissionState = rememberMultiplePermissionsState(
        permissions = listOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.CAMERA
        )
    )

    fun fetchCurrentGps() {
        fusedLocationClient.lastLocation.addOnSuccessListener { loc ->
            if (loc != null) {
                latitude = loc.latitude
                longitude = loc.longitude
                locationName = "Survey Point (\${loc.latitude.toString().take(6)}, \${loc.longitude.toString().take(6)})"
            }
        }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("Remote Locations Waste Survey", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text(
                "Scan waste in remote outdoor areas (beaches, forests, open grounds) and tag with live GPS coordinates.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )
        }

        item {
            Card(shape = RoundedCornerShape(16.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Current GPS Coordinates", fontWeight = FontWeight.Bold)
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

                    Text("Zone: $locationName", fontWeight = FontWeight.SemiBold)
                    Text("Lat: $latitude • Lon: $longitude", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                }
            }
        }

        item {
            Button(
                onClick = { /* Launch camera survey with GPS tag */ },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                modifier = Modifier.fillMaxWidth().height(50.dp)
            ) {
                Icon(Icons.Default.PhotoCamera, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Scan Waste with GPS Location")
            }
        }

        item {
            Text("Recent Remote Surveys", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Card(shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Silver Beach Coastal Trail Sector 4", fontWeight = FontWeight.SemiBold)
                    Text("Category: Non-Biodegradable (Plastic bottles, fishing gear)", color = Color(0xFFC62828))
                    Text("GPS: 13.0475° N, 80.2824° E", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Action: Sanitation crew notified for off-road retrieval.", style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}
