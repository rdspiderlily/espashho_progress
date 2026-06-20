import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function BusinessDiscover() {
  const router = useRouter();

  // state tracker for filter overlay layer visibility
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleSearchPress = () => {
    Alert.alert("Search", "Opening discovery context search parameters...");
  };

  const handleFilterPress = () => {
    setIsFilterVisible(true);
  };

  const handlePinPress = (businessName: string) => {
    Alert.alert("Map Target Toggle", `Focusing structural pin focus matrix on: ${businessName}`);
  };

  const handleViewDetailsPress = () => {
    Alert.alert("Deep Analytics", "Opening expanded details, crowdsourced historical graph trends, and operational schedules...");
  };

  const handleAmenityPress = (amenityTitle: string) => {
    Alert.alert("Amenity Inspection", `Displaying deep historical log entries for: ${amenityTitle}`);
  };

  const handleDirectionsPress = () => {
    Alert.alert("Spatial Navigation Trigger", "Passing geo-coordinates context track payload to external device mapping applications...");
  };

  const applyFilters = () => {
    Alert.alert("Filters Applied", "Re-indexing spatial structural matrix matching parameters...");
    setIsFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* ===== LAYER 0: MAP CANVAS ===== */}
      <View style={styles.mapCanvas}>
        {/* Map Grid Lines (Mock Map background canvas) */}
        <View style={styles.mapGrid}>
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
        </View>

        {/* Map Pins - Primary Pin */}
        <TouchableOpacity 
          style={[styles.pinContainer, { bottom: 360, left: width * 0.42 }]}
          onPress={() => handlePinPress("On What Grounds? Coffee")}
          activeOpacity={0.7}
        >
          <View style={styles.pinTeardropGreen}>
            <View style={styles.pinDot} />
          </View>
          <View style={styles.pinAmberBadge}>
            <Ionicons name="bulb" size={8} color="#042652" />
            <Text style={styles.pinBadgeText}>65%</Text>
          </View>
          <Text style={styles.pinLabel}>On What Grounds? Coffee</Text>
        </TouchableOpacity>

        {/* Secondary Pin - Brew it All */}
        <TouchableOpacity 
          style={[styles.pinContainer, { top: 220, right: 50 }]}
          onPress={() => handlePinPress("Brew it All")}
          activeOpacity={0.7}
        >
          <View style={styles.pinTeardropYellow}>
            <Ionicons name="ribbon-outline" size={10} color="#FFFFFF" style={{ marginTop: -2 }} />
          </View>
          <Text style={styles.pinLabelSmall}>Brew it All</Text>
        </TouchableOpacity>

        {/* Secondary Pin - Coffee Project Ayala */}
        <TouchableOpacity 
          style={[styles.pinContainer, { bottom: 240, left: 40 }]}
          onPress={() => handlePinPress("Coffee Project Ayala")}
          activeOpacity={0.7}
        >
          <View style={styles.pinTeardropGreen}>
            <View style={styles.pinDot} />
          </View>
          <Text style={styles.pinLabelSmall}>Coffee Project Ayala</Text>
        </TouchableOpacity>
      </View>

      {/* ===== SEARCH BAR (Floating) ===== */}
      <View style={styles.searchBar}>
        <TouchableOpacity 
          style={styles.searchBarInteractiveTarget} 
          onPress={handleSearchPress}
          activeOpacity={0.6}
        >
          <Ionicons name="search" size={18} color="#042652" style={{ marginRight: 8 }} />
          <Text style={styles.searchText}>On What Grounds? Coffee</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterIconButtonTarget} onPress={handleFilterPress} activeOpacity={0.6}>
          <Ionicons name="funnel-outline" size={18} color="#0084FF" />
        </TouchableOpacity>
      </View>

      {/* ===== FLOATING DETAIL SHEET ===== */}
      <View style={styles.detailSheet}>
        {/* Top Absolute Close Handle */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.push("/businessHome")}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={18} color="#042652" />
        </TouchableOpacity>

        {/* Dynamic Inner Flex Wrapper to handle structural card stretching */}
        <View style={styles.sheetMainContent}>
          
          {/* Header Block Row: Title & Brand Stamp Logo */}
          <View style={styles.sheetHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.sheetTitle}>On What Grounds?{"\n"}Coffee</Text>
              
              {/* Rating Row safely positioned under the business title text track */}
              <View style={styles.ratingRow}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>(5.0)</Text>
                </View>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              </View>
            </View>

            {/* Circular Branding Logo Stamp Graphic */}
            <View style={styles.brandingLogo}>
              <Ionicons name="wifi" size={14} color="#0988EE" style={styles.logoCenterIcon} />
              <Text style={styles.brandingLogoText}>QUIET</Text>
              <Text style={styles.brandingSubText}>CERTIFIED</Text>
            </View>
          </View>

          {/* Tier & Live Telemetry Info Row */}
          <View style={styles.tierRow}>
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>Tier 1</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Now</Text>
            </View>
            <View style={styles.usersBadge}>
              <Ionicons name="people-outline" size={12} color="#718096" style={{ marginRight: 4 }} />
              <Text style={styles.usersText}>3 Users Recording</Text>
            </View>
          </View>

          {/* Amenities Section Sub-header Row */}
          <View style={styles.amenitiesHeader}>
            <Text style={styles.amenitiesTitle}>Amenities</Text>
            <TouchableOpacity onPress={handleViewDetailsPress} activeOpacity={0.6}>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>

          {/* Amenities 2x2 Bento Grid Block */}
          <View style={styles.amenitiesGrid}>
            {/* Cell 1: Noise Level */}
            <TouchableOpacity 
              style={styles.amenityCard} 
              onPress={() => handleAmenityPress("Noise Level")}
              activeOpacity={0.8}
            >
              <View style={styles.amenityCardHeader}>
                <Ionicons name="volume-high" size={15} color="#0988EE" />
                <Text style={styles.amenityCardValue} numberOfLines={1}>Noise: 45 dB</Text>
              </View>
              <Text style={styles.amenitySubtext} numberOfLines={1}>
                Deep Focus <Text style={{ color: '#00C853', fontWeight: '700' }}>• Live</Text>
              </Text>
            </TouchableOpacity>

            {/* Cell 2: Lighting Parameters */}
            <TouchableOpacity 
              style={styles.amenityCard} 
              onPress={() => handleAmenityPress("Lighting Parameters")}
              activeOpacity={0.8}
            >
              <View style={styles.amenityCardHeader}>
                <Ionicons name="bulb" size={15} color="#FFC107" />
                <Text style={styles.amenityCardValue} numberOfLines={1}>Light: 450 lux</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                <Text style={styles.amenitySubtext}>Reading </Text>
                <View style={styles.amberChipLight}>
                  <Ionicons name="bulb" size={8} color="#042652" />
                  <Text style={styles.amberChipText}>65%</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Cell 3: WiFi Availability Status */}
            <TouchableOpacity 
              style={styles.amenityCard} 
              onPress={() => handleAmenityPress("WiFi Status")}
              activeOpacity={0.8}
            >
              <View style={styles.amenityCardHeader}>
                <Ionicons name="wifi" size={15} color="#0988EE" />
                <Text style={styles.amenityCardValue} numberOfLines={1}>WiFi: Available</Text>
              </View>
              <Text style={styles.amenitySubtext} numberOfLines={1}>
                <Ionicons name="time-outline" size={10} color="#A0AEC0" /> 7am - 10pm
              </Text>
            </TouchableOpacity>

            {/* Cell 4: Outlet Infrastructure Details */}
            <TouchableOpacity 
              style={styles.amenityCard} 
              onPress={() => handleAmenityPress("Outlet Infrastructure")}
              activeOpacity={0.8}
            >
              <View style={styles.amenityCardHeader}>
                <Ionicons name="flash" size={15} color="#0988EE" />
                <Text style={styles.amenityCardValue} numberOfLines={1}>Outlets: 25</Text>
              </View>
              <Text style={styles.amenitySubtext} numberOfLines={1}>
                Status: <Text style={{ fontWeight: '600', color: '#042652' }}>Pay to Stay</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Spatial Directions Routing Block Footer */}
          <View style={styles.directionsSection}>
            <Text style={styles.directionsTitle}>Directions</Text>
            <View style={styles.distanceBlock}>
              <Text style={styles.distanceText}>Estimated Distance</Text>
              <Text style={styles.distanceValue}>4 Km Away</Text>
            </View>
            <TouchableOpacity 
              style={styles.directionsButton} 
              onPress={handleDirectionsPress}
              activeOpacity={0.8}
            >
              <Text style={styles.directionsButtonText}>Click me for Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ===== LAYER 10: AMENITY FILTER MATRIX OVERLAY ===== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isFilterVisible}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={styles.modalTitle}>Filter</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={() => setIsFilterVisible(false)}
              >
                <Ionicons name="close" size={20} color="#042652" />
              </TouchableOpacity>
            </View>

            {/* --- Noise Level Segment --- */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Noise Level</Text>
              <View style={styles.filterGroup}>
                <TouchableOpacity style={[styles.noiseButton, { backgroundColor: "#00C853" }]} activeOpacity={0.7}>
                  <Text style={styles.filterButtonText}>Quiet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.noiseButton, { backgroundColor: "#FFC107" }]} activeOpacity={0.7}>
                  <Text style={styles.filterButtonText}>Moderate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.noiseButton, { backgroundColor: "#FF0000" }]} activeOpacity={0.7}>
                  <Text style={styles.filterButtonText}>Loud</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* --- Light Level Segment --- */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Light Level</Text>
              <View style={styles.filterGroup}>
                {/* Very Bright */}
                <View style={styles.lightChipContainer}>
                  <View style={styles.lightChip}>
                    <Ionicons name="bulb" size={12} color="#FFC107" />
                    <Text style={styles.lightChipPct}>100%</Text>
                  </View>
                  <Text style={styles.lightChipLabel}>Very Bright</Text>
                </View>
                {/* Normal */}
                <View style={styles.lightChipContainer}>
                  <View style={styles.lightChip}>
                    <Ionicons name="bulb" size={12} color="#FFC107" />
                    <Text style={styles.lightChipPct}>65%</Text>
                  </View>
                  <Text style={styles.lightChipLabel}>Normal</Text>
                </View>
                {/* Dimly Lit */}
                <View style={styles.lightChipContainer}>
                  <View style={styles.lightChip}>
                    <Ionicons name="bulb" size={12} color="#FFC107" />
                    <Text style={styles.lightChipPct}>30%</Text>
                  </View>
                  <Text style={styles.lightChipLabel}>Dimly Lit</Text>
                </View>
                {/* Dark */}
                <View style={styles.lightChipContainer}>
                  <View style={styles.lightChip}>
                    <Ionicons name="bulb" size={12} color="#FFC107" />
                    <Text style={styles.lightChipPct}>0%</Text>
                  </View>
                  <Text style={styles.lightChipLabel}>Dark</Text>
                </View>
              </View>
            </View>

            {/* --- Price Segment --- */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price</Text>
              <View style={styles.filterGroup}>
                <TouchableOpacity style={styles.priceButton} activeOpacity={0.7}>
                  <Text style={styles.filterButtonText}>Free to Stay</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.priceButton} activeOpacity={0.7}>
                  <Text style={styles.filterButtonText}>Order/ Pay to Stay</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Footer Button */}
            <TouchableOpacity 
              style={styles.modalApplyButton} 
              onPress={applyFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.modalApplyButtonText}>Apply Filter Parameters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== BOTTOM NAVIGATION - UNCHANGED ===== */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/businessHome")}>
          <Ionicons name="map-outline" size={20} color="#042652" />
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/businessDiscover")}>
          <Ionicons name="compass-outline" size={20} color="#0988EE" />
          <Text style={[styles.navText, styles.navTextActive]}>Discover</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="analytics-outline" size={20} color="#042652" />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.navItemMiddle]} onPress={() => {}}>
          <View style={styles.addButton}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </View>
          <Text style={[styles.navText, styles.navTextActive]}>Add</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="calendar-outline" size={20} color="#042652" />
          <Text style={styles.navText}>Events</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="person-outline" size={20} color="#042652" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <Ionicons name="settings-outline" size={20} color="#042652" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  // ===== MAP CANVAS UNDERLAY =====
  mapCanvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F4F7FA",
  },
  mapGrid: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 100,
  },
  mapGridRow: {
    height: 2,
    backgroundColor: "#E4ECF2",
    width: "100%",
  },

  // ===== MAP CANVAS OBJECT PINS =====
  pinContainer: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  pinTeardropGreen: {
    width: 28,
    height: 38,
    backgroundColor: "#00C853",
    borderRadius: 14,
    borderBottomRightRadius: 0,
    transform: [{ rotate: "-45deg" }],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  pinTeardropYellow: {
    width: 24,
    height: 32,
    backgroundColor: "#FFC107",
    borderRadius: 12,
    borderBottomRightRadius: 0,
    transform: [{ rotate: "-45deg" }],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
  },
  pinAmberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD600",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    position: "absolute",
    bottom: 14,
    zIndex: 12,
  },
  pinBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#042652",
    marginLeft: 1,
  },
  pinLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#042652",
    marginTop: 6,
    textShadowColor: "#FFFFFF",
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
  },
  pinLabelSmall: {
    fontSize: 9,
    fontWeight: "600",
    color: "#4A5568",
    marginTop: 6,
    textShadowColor: "#FFFFFF",
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
  },

  // ===== TOP SEARCH CONTAINER =====
  searchBar: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  searchBarInteractiveTarget: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  searchText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A202C",
  },
  filterIconButtonTarget: {
    paddingLeft: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== FLOATING EXPANDED SURFACE PANEL =====
  detailSheet: {
    position: "absolute",
    top: 112, 
    bottom: 96, 
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 90,
  },
  sheetMainContent: {
    flex: 1,
    justifyContent: "space-between", 
  },

  // ===== SECTION HEADER & BRAND GRAPHICS =====
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  sheetTitle: {
    fontSize: 22, 
    fontWeight: "800",
    color: "#042652",
    lineHeight: 26,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A5568",
    marginLeft: 4,
  },
  featuredBadge: {
    backgroundColor: "#0084FF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 110,
  },
  brandingLogo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "#A3D3FF",
    backgroundColor: "#EDF6FF",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    marginTop: -4,
  },
  brandingLogoText: {
    fontSize: 7,
    fontWeight: "900",
    color: "#042652",
    textAlign: "center",
    letterSpacing: 0.2,
    marginTop: 1,
  },
  brandingSubText: {
    fontSize: 5,
    fontWeight: "700",
    color: "#0988EE",
    textAlign: "center",
  },
  logoCenterIcon: {
    marginBottom: -1,
  },

  // ===== METADATA SUB-INFRASTRUCTURE TRACKS =====
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  tierBadge: {
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0988EE",
    marginRight: 8,
  },
  tierText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0988EE",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4D4D",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  usersBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  usersText: {
    fontSize: 10,
    color: "#718096",
    fontWeight: "500",
  },

  // ===== AMENITIES SECTION HEADER CONTROLS =====
  amenitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#042652",
  },
  viewDetailsText: {
    fontSize: 12,
    color: "#0084FF",
    fontWeight: "700",
  },

  // ===== BENTO GRID DASHBOARD MATRIX =====
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amenityCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    minHeight: 58,
    justifyContent: "center",
  },
  amenityCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  amenityCardValue: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#042652",
    marginLeft: 5,
  },
  amenitySubtext: {
    fontSize: 9,
    color: "#718096",
    fontWeight: "500",
    lineHeight: 12,
  },
  amberChipLight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD600",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
  },
  amberChipText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#042652",
    marginLeft: 2,
  },

  // ===== DIRECTIONS CARD INTERFACES =====
  directionsSection: {
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    paddingTop: 12,
  },
  directionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#042652",
    marginBottom: 4,
  },
  distanceBlock: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1A365D",
  },
  distanceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0084FF",
    marginTop: 2,
  },
  directionsButton: {
    backgroundColor: "#0084FF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ===== BOTTOM NAVIGATION CONTROLS =====
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    zIndex: 200,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navItemMiddle: {
    flex: 1.2,
  },
  navText: {
    fontSize: 9,
    color: "#042652",
    marginTop: 2,
  },
  navTextActive: {
    color: "#0988EE",
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#0988EE",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // ===== AMENITY FILTER MATRIX OVERLAY STYLES =====
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginLeft: 24, // compensates for the side close icon to keep title centered
  },
  modalCloseButton: {
    padding: 4,
  },
  filterSection: {
    marginBottom: 18,
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0084FF",
    marginBottom: 10,
  },
  filterGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  noiseButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  lightChipContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  lightChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderTopLeftRadius: 0,
  },
  lightChipPct: {
    fontSize: 9,
    fontWeight: "700",
    color: "#042652",
    marginLeft: 2,
  },
  lightChipLabel: {
    fontSize: 9,
    color: "#4A5568",
    marginTop: 4,
    fontWeight: "500",
  },
  priceButton: {
    backgroundColor: "#0084FF",
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalApplyButton: {
    backgroundColor: "#0084FF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  modalApplyButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});