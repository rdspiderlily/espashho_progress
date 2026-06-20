import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function BusinessHome() {
  const router = useRouter();
  
  // State control to display or hide the notification dropdown panel overlay
  const [showNotifications, setShowNotifications] = useState(false);

  // Hardcoded mock notifications precisely mirroring the prototype from image_9358e9.png
  const MOCK_NOTIFICATIONS = [
    {
      id: "1",
      category: "EVENTS",
      body: "New event created at your space",
      time: "Just now",
      icon: "calendar",
      unread: true,
    },
    {
      id: "2",
      category: "REVIEWS",
      body: "New 5-star review on your space",
      time: "Just now",
      icon: "location", 
      unread: true,
    },
    {
      id: "3",
      category: "SUBSCRIPTION",
      body: "Your Premium expires in 5 days",
      time: "2 hours ago",
      icon: "card", 
      unread: false,
    },
    {
      id: "4",
      category: "SPACE REVIEW",
      body: "Five students posted a review and rating on your business space.",
      time: "April 30, 2026",
      icon: "star",
      unread: false,
    },
    {
      id: "5",
      category: "CERTIFICATION",
      body: "OWG Coffee is now Quiet Certified. Click to view and display badge for students to recognize your space.",
      time: "", 
      icon: "book", 
      unread: false,
    },
  ];

  const handleSearchPress = () => {
    Alert.alert("Search", "Opening search overlay context...");
  };

  const handleFilterPress = () => {
    Alert.alert("Filter", "Opening advanced map filtering options...");
  };

  const handleDropdownPress = () => {
    Alert.alert("Location Context", "Opening workspace area location switcher dropdown...");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handlePinPress = (businessName: string) => {
    Alert.alert("Map Object Select", `Focusing camera metrics coordinate track on: ${businessName}`);
  };

  const handleCardPress = () => {
    router.push("/businessDiscover");
  };

  const handlePlusCodePress = () => {
    Alert.alert("Plus Code Copy", "Full routing string copied to clipboard text register.");
  };

  const handleNotificationItemPress = (category: string) => {
    Alert.alert("Notification Deep Link", `Routing interface contexts to historical log trace for: ${category}`);
  };

  return (
    <View style={styles.container}>
      {/* ===== LAYER 0: MAP CANVAS ===== */}
      <View style={styles.mapCanvas}>
        {/* Map Grid Lines */}
        <View style={styles.mapGrid}>
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
          <View style={styles.mapGridRow} />
        </View>

        {/* ===== MAP PINS ===== */}
        <TouchableOpacity 
          style={[styles.pinContainer, { bottom: 340, left: width * 0.42 }]}
          onPress={() => handlePinPress("On What Grounds? Coffee")}
          activeOpacity={0.7}
        >
          <View style={styles.pinTeardropGreen}>
            <View style={styles.pinDot} />
          </View>
          <View style={styles.pinAmberBadge}>
            <Ionicons name="bulb" size={10} color="#042652" />
            <Text style={styles.pinBadgeText}>65%</Text>
          </View>
          <Text style={styles.pinLabelTextOutside}>On What Grounds? Coffee</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.pinContainer, { top: 240, right: 60 }]}
          onPress={() => handlePinPress("Brew it All")}
          activeOpacity={0.7}
        >
          <View style={styles.pinTeardropYellow}>
            <Ionicons name="ribbon-outline" size={10} color="#FFFFFF" style={{ marginTop: -2 }} />
          </View>
          <View style={styles.secondaryPinTextWrapper}>
            <Text style={styles.pinLabelTextOutsideSecondary}>Brew it All</Text>
            <Text style={styles.pinLabelTextOutsideSecondarySub}>You can Coffee</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.pinContainer, { bottom: 240, left: 50 }]}
          onPress={() => handlePinPress("Coffee Project Ayala")}
          activeOpacity={0.7}
        >
          <View style={styles.pinTeardropGreen}>
            <View style={styles.pinDot} />
          </View>
          <Text style={styles.pinLabelTextOutsideSecondary}>Coffee Project Ayala</Text>
        </TouchableOpacity>
      </View>

      {/* ===== HEADER DROPDOWN ===== */}
      <TouchableOpacity 
        style={styles.headerDropdown} 
        onPress={handleDropdownPress}
        activeOpacity={0.85}
      >
        <View style={styles.headerDropdownContent}>
          <View style={{ flex: 1, paddingRight: 4 }}>
            <Text style={styles.headerTitle} numberOfLines={1}>On What Grounds? Coffee?</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              123, University Ave, Cebu City, Philippines
            </Text>
          </View>
          <Ionicons name="triangle" size={10} color="#0084FF" style={styles.dropdownTriangleMarker} />
        </View>
      </TouchableOpacity>

      {/* ===== NOTIFICATION BUTTON ===== */}
      <TouchableOpacity 
        style={[styles.notificationButton, showNotifications && styles.notificationButtonActive]} 
        onPress={toggleNotifications}
        activeOpacity={0.8}
      >
        <Ionicons name="notifications" size={20} color={showNotifications ? "#0084FF" : "#FFFFFF"} />
        {!showNotifications && <View style={styles.notificationBadge} />}
      </TouchableOpacity>

      {/* ===== SEARCH BAR ===== */}
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

      {/* ===== METRICS SHEET ===== */}
      <TouchableOpacity 
        style={styles.metricsSheet} 
        onPress={handleCardPress}
        activeOpacity={0.95}
      >
        <View style={styles.metricsRow}>
          <Text style={styles.metricsTitle} numberOfLines={1}>On What Grounds? Coffee</Text>
          <Ionicons name="checkmark-circle" size={18} color="#00C853" />
        </View>

        <View style={styles.quietCertifiedChip}>
          <Text style={styles.quietCertifiedText}>Quiet Certified</Text>
        </View>

        <View style={styles.liveStatsRow}>
          <View style={styles.liveStatItem}>
            <View style={styles.liveDot} />
            <Text style={styles.liveStatLabel}>Live: </Text>
            <Text style={styles.liveStatValue}>45 dB</Text>
          </View>
          <Text style={styles.liveStatTime}> - 5 min ago</Text>
          
          <View style={[styles.liveStatItem, { marginLeft: 14 }]}>
            <Ionicons name="bulb" size={14} color="#FFD600" style={{ marginRight: 3 }} />
            <Text style={styles.liveStatLabel}>Lighting: </Text>
            <Text style={styles.liveStatValue}>450 lux</Text>
          </View>
        </View>

        <View style={styles.amenitiesCombinedRow}>
          <View style={styles.amenityTag}>
            <Ionicons name="wifi" size={12} color="#0084FF" />
            <Text style={styles.amenityText}>WiFi</Text>
          </View>
          <View style={styles.amenityTag}>
            <Ionicons name="cash" size={12} color="#0084FF" />
            <Text style={styles.amenityText}>Paid</Text>
          </View>
          <View style={styles.amenityTag}>
            <Ionicons name="checkmark" size={12} color="#0084FF" />
            <Text style={styles.amenityText}>Available</Text>
          </View>

          <View style={styles.unifiedAmbientWrapper}>
            <Text style={styles.ambientTextInline}>Normal Brightness</Text>
            <View style={styles.percentTagInline}>
              <Ionicons name="bulb" size={10} color="#042652" style={{ marginRight: 1 }} />
              <Text style={styles.percentTextInline}>65%</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* ===== PLUS CODE BANNER ===== */}
      <TouchableOpacity 
        style={styles.plusCodeBanner} 
        onPress={handlePlusCodePress}
        activeOpacity={0.8}
      >
        <Text style={styles.plusCodeText} numberOfLines={1}>
          7WR3+QCH, M. J. Cuenco Ave, Cebu City, 6000 Cebu
        </Text>
      </TouchableOpacity>

      {/* ===== PIXEL PERFECT NOTIFICATION OVERLAY (image_9358e9.png Layout Match) ===== */}
      {showNotifications && (
        <>
          {/* Transparent Dark Backdrop Layer covering under elements */}
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={toggleNotifications} 
          />
          
          {/* Main Floating Notification Sheet */}
          <View style={styles.notificationModal}>
            {/* Clean White Top Bar Header Container */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Notifications</Text>
            </View>
            
            <ScrollView style={styles.modalContentScroll} showsVerticalScrollIndicator={false}>
              {MOCK_NOTIFICATIONS.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.notificationItemRow, item.unread && styles.notificationItemRowUnread]}
                  onPress={() => handleNotificationItemPress(item.category)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationIconContainer}>
                    <Ionicons name={item.icon as any} size={24} color="#0084FF" />
                  </View>
                  
                  <View style={styles.notificationTextContainer}>
                    <View style={styles.notificationMetaRow}>
                      <Text style={styles.notificationCategoryTitle}>{item.category}</Text>
                      {item.time ? <Text style={styles.notificationTimeText}>{item.time}</Text> : null}
                    </View>
                    <Text style={styles.notificationBodyText}>{item.body}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {/* ===== BOTTOM NAVIGATION ===== */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/businessHome")}>
          <Ionicons name="map-outline" size={20} color="#0988EE" />
          <Text style={[styles.navText, styles.navTextActive]}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/businessDiscover")}>
          <Ionicons name="compass-outline" size={20} color="#042652" />
          <Text style={styles.navText}>Discover</Text>
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

  // ===== MAP CANVAS =====
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

  // ===== MAP PINS =====
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
  pinLabelTextOutside: {
    fontSize: 12,
    fontWeight: "700",
    color: "#042652",
    marginTop: 8,
    textShadowColor: "#FFFFFF",
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
  },
  secondaryPinTextWrapper: {
    alignItems: "center",
    marginTop: 4,
  },
  pinLabelTextOutsideSecondary: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4A5568",
  },
  pinLabelTextOutsideSecondarySub: {
    fontSize: 9,
    color: "#718096",
  },

  // ===== HEADER DROPDOWN =====
  headerDropdown: {
    position: "absolute",
    top: 44,
    left: 16,
    right: 76,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 90, // Lowered beneath modal triggers
  },
  headerDropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 13,
    color: "#042652",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#718096",
    marginTop: 1,
  },
  dropdownTriangleMarker: {
    transform: [{ rotate: "180deg" }],
    marginLeft: 6,
  },

  // ===== NOTIFICATION BUTTON =====
  notificationButton: {
    position: "absolute",
    top: 44,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0084FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 300, // Elevated to ensure tap toggle track works globally
  },
  notificationButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0.15,
  },
  notificationBadge: {
    position: "absolute",
    top: 13,
    right: 14,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },

  // ===== SEARCH BAR =====
  searchBar: {
    position: "absolute",
    top: 104,
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
    zIndex: 80, // Kept completely beneath modal surfaces
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

  // ===== UPDATED HIGH-LAYER NOTIFICATION MODAL =====
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 38, 82, 0.2)", 
    zIndex: 200, // Background mask sits cleanly on top of map controls
  },
  notificationModal: {
    position: "absolute",
    top: 114, // Pushed slightly lower to mirror image_9358e9.png spacing layout perfectly
    left: 16,
    right: 16,
    maxHeight: height * 0.58, 
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 12,
    zIndex: 250, // Higher index forces search bar background layers to stay beneath it completely
    overflow: "hidden",
  },
  modalHeader: {
    width: "100%",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: "700", // Bolder style exactly like the prototype
    color: "#1A202C",
  },
  modalContentScroll: {
    backgroundColor: "#FFFFFF",
  },
  notificationItemRow: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F6FA",
    alignItems: "flex-start",
  },
  notificationItemRowUnread: {
    backgroundColor: "#F0F7FF", 
  },
  notificationIconContainer: {
    marginRight: 14,
    marginTop: 2,
    width: 26,
    alignItems: "center",
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationCategoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0084FF", 
  },
  notificationTimeText: {
    fontSize: 10,
    color: "#A0AEC0",
    fontWeight: "400",
  },
  notificationBodyText: {
    fontSize: 11,
    color: "#4A5568",
    lineHeight: 16,
    fontWeight: "400",
    flexWrap: "wrap",
  },

  // ===== METRICS SHEET =====
  metricsSheet: {
    position: "absolute",
    bottom: 154, 
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 70,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metricsTitle: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#042652",
    marginRight: 6,
  },
  quietCertifiedChip: {
    backgroundColor: "#0084FF",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  quietCertifiedText: {
    fontWeight: "600",
    fontSize: 11,
    color: "#FFFFFF",
  },
  liveStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  liveStatItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00C853",
    marginRight: 5,
  },
  liveStatLabel: {
    fontSize: 12,
    color: "#4A5568",
  },
  liveStatValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#042652",
  },
  liveStatTime: {
    fontSize: 11,
    color: "#A0AEC0",
    marginLeft: 2,
  },
  amenitiesCombinedRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  amenityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginVertical: 2,
  },
  amenityText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#042652",
    marginLeft: 4,
  },
  unifiedAmbientWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    paddingLeft: 8,
    paddingRight: 2,
    paddingVertical: 2,
    borderRadius: 20,
    marginLeft: "auto",
    marginVertical: 2,
  },
  ambientTextInline: {
    fontSize: 11,
    color: "#0084FF",
    fontWeight: "500",
    marginRight: 6,
  },
  percentTagInline: {
    backgroundColor: "#FFD600",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  percentTextInline: {
    fontSize: 11,
    fontWeight: "700",
    color: "#042652",
  },

  // ===== PLUS CODE BANNER =====
  plusCodeBanner: {
    position: "absolute",
    bottom: 106, 
    left: 16,
    right: 16,
    height: 38,
    backgroundColor: "#0084FF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    zIndex: 65,
  },
  plusCodeText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  // ===== BOTTOM NAVIGATION =====
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
    zIndex: 350, // Placed higher than the overlay layers
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
});