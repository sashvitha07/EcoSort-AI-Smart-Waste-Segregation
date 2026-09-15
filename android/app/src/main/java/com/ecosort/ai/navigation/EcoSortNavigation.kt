package com.ecosort.ai.navigation

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
