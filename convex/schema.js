import {defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({ 
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),
        imageUrl: v.optional(v.string()),
    }).index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .searchIndex("search_name", {searchField: "name"})
    .searchIndex("search_email", {searchField: "email"}),

    expenses: defineTable({
        description: v.string(),
        amount: v.number(),
        category: v.optional(v.string()),
        date: v.number(), 
        paidByUserId: v.id("users"), 
        splitType: v.string(), // "equal", "percentage", "exact"
        splits: v.array(v.object({
            userId: v.id("users"), // Reference to this user table
            amount: v.number(), //amount owed by this user
            paid: v.boolean(),
        })
    ),
    groupId: v.optional(v.id("groups")), //undefined for one-on-one expenses
    createdBy: v.id("users"),  
    })
    .index("by_group", ["groupId"])
    .index("by_user_And_group", ["paidByUserId", "groupId"])
    .index("by_date", ["date"]),


    groups: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdBy: v.id("users"),
        members: v.array(
            v.object({
                userId: v.id("users"), // Reference to this user table
                role:v.string(), // "admin", "member"
                joinedAt: v.number(), // Timestamp when the user joined the group
            })
        ), 
    }),

    settlements: defineTable({
        amount: v.number(),
        note: v.optional(v.string()),
        date: v.number(), // Timestamp of the settlement
        paidByUserId: v.id("users"), // User who made the settlement
        receivedByUserId: v.id("users"), // User who received the settlement
        groupId: v.optional(v.id("groups")), //Undefined Group ID if applicable
        relatedExpenseIds: v.optional(v.array(v.id("expenses"))), // Related expenses if any
        createdBy: v.id("users"), // User who created the settlement
    })
    .index("by_group", ["groupId"])
    .index("by_user_and_group", ["paidByUserId", "groupId"])
    .index("by_date", ["date"])
    .index("by_receiver_and_group", ["receivedByUserId", "groupId"]),

})

