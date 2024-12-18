// SelectPayment.js
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  selectCheckout,
  selectRentalCheckout,
} from "../../api/Checkout/apiCheckout";
import PaymentMethod from "../../components/Payment/PaymentMethod";
import { Feather } from "@expo/vector-icons";
import { ModalPayment } from "./PaymentSuccess/ModalPayment";

function SelectPayment({ route }) {
  const { order } = route.params;
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("1");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [modalVisiblePayment, setModalVisiblePayment] = useState(false);
  const [linkPayment,setLinkPayment]=useState("")
  const [deposit, setDeposit] = useState("DEPOSIT_50");
  const handleCheck = async () => {
    if (paymentCompleted) {
      return;
    }
    const _d = order?.saleOrderCode ? {} : { transactionType: deposit };
    try {
      if (selectedOption === "1") {
        // COD
        setPaymentCompleted(true);
        const data = order.rentalOrderCode
          ? await selectRentalCheckout({
              paymentMethodID: parseInt(selectedOption),
              orderId: order.id,
              orderCode: order.rentalOrderCode,
              ..._d,
            })
          : await selectCheckout({
              paymentMethodID: parseInt(selectedOption),
              orderId: order.id,
              orderCode: order.saleOrderCode,
              ..._d,
            });
            navigation.navigate("AfterPayment")
      } else if (selectedOption === "2" || selectedOption === "3") {
        // PayOS or VNPay
        const data = order.rentalOrderCode
          ? await selectRentalCheckout({
              paymentMethodID: parseInt(selectedOption),
              orderId: order.id,
              orderCode: order.rentalOrderCode,
              ..._d,
            })
          : await selectCheckout({
              paymentMethodID: parseInt(selectedOption),
              orderId: order.id,
              orderCode: order.saleOrderCode,
              ..._d,
            });

        if (data?.data?.data?.paymentLink) {
          setLinkPayment(data.data.data.paymentLink)
          setModalVisiblePayment(true)
          // Linking.canOpenURL(data.data.data.paymentLink).then((supported) => {
          //   if (supported) {
          //     // Linking.openURL(data.data.data.paymentLink);
             
          //   } else {
          //     console.log("Can't open URI:", data.data.data.paymentLink);
          //   }
          // });
        }

        // setPaymentCompleted(true);
        // Alert.alert("Thanh toán thành công", "Bạn đã thanh toán thành công.", [
        //   { text: "OK", onPress: () => navigation.navigate("HomeController") },
        // ]);
      } else if (selectedOption === "4") {
        // Bank Transfer
        const data = order.rentalOrderCode
          ? await selectRentalCheckout({
              paymentMethodID: parseInt(selectedOption),
              orderId: order.id,
              orderCode: order.rentalOrderCode,
              ..._d,
            })
          : await selectCheckout({
              paymentMethodID: parseInt(selectedOption),
              orderId: order.id,
              orderCode: order.saleOrderCode,
              ..._d,
            });
        setPaymentCompleted(true);
        Alert.alert(
          "Thanh toán thành công",
          "Bạn đã chọn thanh toán qua chuyển khoản ngân hàng.",
          [{ text: "OK", onPress: () => navigation.navigate("HomeController") }]
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      Alert.alert(
        "Lỗi",
        "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."
      );
    }
  };

  const data =
    order.saleOrderDetailVMs?.["$values"] ||
    order.children ||
    order?.childOrders?.["$values"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trạng thái đơn hàng</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.card}>
            <InfoItem icon="user" label="Tên" value={order.fullName} />
            <InfoItem icon="mail" label="Email" value={order.email} />
            <InfoItem
              icon="phone"
              label="Số điện thoại"
              value={order.contactPhone}
            />
            <InfoItem icon="map-pin" label="Địa chỉ" value={order.address} />
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
          <View style={styles.card}>
            {(data?.length > 0 ? data : [order]).map((item, index) => {
              const _item = { ...item };
              return (
                <View
                  key={item?.id}
                  style={{
                    flexDirection: "column",
                    gap: 8,
                    paddingBottom: 10,
                    marginBottom: 20,
                    borderBottom: "0.5px solid #e0e0e0",
                  }}
                >
                  <View style={styles.cardItem}>
                    <Image
                      source={{
                        uri:
                          _item?.imgAvatarPath ||
                          "https://via.placeholder.com/100",
                      }}
                      style={{ width: 80, height: 80 }}
                    />
                    <View key={index} style={styles.itemRow}>
                      <View>
                        <Text style={styles.itemName}>{_item.productName}</Text>
                        <Text style={styles.itemName2}>
                          Màu sắc: {_item.color}
                        </Text>
                        <Text style={styles.itemName2}>
                          Kích thước: {_item.size}
                        </Text>
                        <Text style={styles.itemName2}>
                          Tình trạng: {_item.condition}%
                        </Text>
                      </View>
                      <Text style={styles.itemQuantity}>
                        x{_item?.quantity}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {formatCurrency(_item.unitPrice || _item.subTotal)}
                      </Text>
                    </View>
                  </View>
                  <View>
                    {item?.rentalStartDate ? (
                      <Text>Ngày bắt đầu thuê: {item?.rentalStartDate}</Text>
                    ) : null}
                    {item?.rentalEndDate ? (
                      <Text>Ngày bắt đầu thuê: {item?.rentalEndDate}</Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
            <TotalItem
              label="Tổng cộng"
              value={formatCurrency(order.totalAmount)}
            />
            <TotalItem
              label="Phí vận chuyển"
              value={formatCurrency(order.tranSportFee)}
            />
            <TotalItem
              label="Thành tiền"
              value={formatCurrency(order.totalAmount + order.tranSportFee)}
              isTotal
            />
          </View>
        </View>

        {/* Payment Method */}
        {order?.saleOrderCode ? (
          <View></View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đặt cọc</Text>
            {[
              { title: "Đặt cọc 50%", value: "DEPOSIT_50" },
              { title: "Trả full 100%", value: "DEPOSIT_100" },
            ].map((item) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => setDeposit(item.value)}
                    style={[
                      styles.optionContainer,
                      selectedOption == item.value && styles.selectedOption,
                    ]}
                    disabled={paymentCompleted}
                  >
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          selectedOption == item.value &&
                            styles.selectedOptionText,
                          paymentCompleted && styles.disabledOptionText,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                    {!order?.depositStatus || order?.depositStatus === "N/A" ? (
                      <View
                        style={[
                          styles.radioButton,
                          deposit == item.value && styles.selectedRadioButton,
                        ]}
                      >
                        {deposit == item.value && (
                          <View style={styles.selectedDot} />
                        )}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <PaymentMethod
            selectedOption={selectedOption || order.paymentMethodID}
            setSelectedOption={setSelectedOption}
            paymentCompleted={paymentCompleted}
            order={order}
          />
        </View>
      </ScrollView>

      {order?.paymentMethodId ? (
        <View></View>
      ) : (
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            paymentCompleted && styles.disabledButton,
          ]}
          onPress={handleCheck}
          disabled={paymentCompleted}
        >
          <Text style={styles.checkoutText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
      )}

      <ModalPayment isVisible={modalVisiblePayment} onClose={()=>{
        setLinkPayment('')
        setModalVisiblePayment(false)
      }} link={linkPayment} onSuccess={()=>{
        setLinkPayment('')
        setModalVisiblePayment(false)
        setPaymentCompleted(true)
        Alert.alert(
          "Thanh toán thành công",
          "Bạn đã xác nhận thanh toán đơn hàng thành công.",
          [{ text: "OK", onPress: () => navigation.navigate("HomeController") }]
        );
      }}/>
    </View>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <Feather name={icon} size={18} color="#666" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const TotalItem = ({ label, value, isTotal = false }) => (
  <View style={[styles.totalItem, isTotal && styles.finalTotal]}>
    <Text style={[styles.totalLabel, isTotal && styles.finalTotalLabel]}>
      {label}
    </Text>
    <Text style={[styles.totalValue, isTotal && styles.finalTotalValue]}>
      {value}
    </Text>
  </View>
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardItem: {
    flexDirection: "row",
    gap: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    flex: 1,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    width: "100%",
  },
  itemName2: {
    flex: 1,
    fontSize: 14,
    color: "#BDC3C7",
    width: "100%",
  },
  itemQuantity: {
    fontSize: 16,
    color: "#666",
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  totalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  finalTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3366FF",
  },
  checkoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#3366FF",
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  checkoutText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  selectedOption: {
    backgroundColor: "#F0F5FF",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#3366FF",
    fontWeight: "600",
  },
  disabledOptionText: {
    color: "#BBBBBB",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3366FF",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadioButton: {
    borderColor: "#3366FF",
    backgroundColor: "#3366FF",
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  disabledRadioButton: {
    borderColor: "#BBBBBB",
  },
  detailsContainer: {
    backgroundColor: "#F9FAFC",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
    lineHeight: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 20,
  },
  bankInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  bankInfoItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bankInfoLabel: {
    fontSize: 14,
    color: "#666666",
    width: 120,
  },
  bankInfoValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
    flex: 1,
  },
});

export default SelectPayment;
