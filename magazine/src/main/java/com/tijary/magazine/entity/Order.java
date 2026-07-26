package com.tijary.magazine.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private Long customerId;

    private String notes;
    private String voiceNoteUrl;

    private String deliveryType; // "PICKUP" | "DELIVERY"
    private String deliveryTime; // free text for now, e.g. "غداً صباحا"
    private String paymentMethod;

    private Integer itemCount;
    private Integer totalQty;

    @Column(precision = 10, scale = 2)
    private BigDecimal savings;
    @Column(precision = 10, scale = 2)
    private BigDecimal deliveryFee;
    @Column(precision = 10, scale = 2)
    private BigDecimal netTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
}
