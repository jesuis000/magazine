package com.tijary.magazine.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    private Long productId; // reference only — may later point to a deleted product

    @Column(nullable = false)
    private String productName; // snapshot at order time — see note below

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal discount;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

}
