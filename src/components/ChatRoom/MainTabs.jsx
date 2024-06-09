import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ChatItem from "./ChatItem";
import "../../styles/ChatRoom/ChatRoom.css";

const dummyData = [
  {
    id: 1,
    imageUrl: "https://via.placeholder.com/150",
    name: "John Doe",
    type: "person",
    lastMessage: "Hello there!",
    isMessageRead: true,
    timeReceived: "2024-06-04T12:30:00",
    unreadMessages: 0,
    isOnline: true,
  },
  {
    id: 2,
    imageUrl: "https://via.placeholder.com/150",
    name: "Jane Smith",
    type: "person",
    lastMessage: "Hey, how are you?",
    isMessageRead: false,
    timeReceived: "2024-06-03T10:15:00",
    unreadMessages: 3,
    isOnline: false,
  },
  {
    id: 3,
    imageUrl: "https://via.placeholder.com/150",
    name: "Group Chat",
    type: "group",
    lastMessage: "Meeting tomorrow at 10AM",
    isMessageRead: true,
    timeReceived: "2024-06-02T14:20:00",
    unreadMessages: 0,
    isOnline: false,
  },
];

export default function MainTabs(props) {
  const groups = dummyData.filter((chat) => chat.type === "group");
  const persons = dummyData.filter((chat) => chat.type === "person");
  const users = props.users;
  console.log("USERS : ", users);
  return (
    <Tabs
      defaultValue="All Chats"
      className="w-100 text-white main-tabs--chat-room"
    >
      <TabsList className="main-tabs-container--chat-room">
        <TabsTrigger value="All Chats" className="tab-element--chat-room">
          All Chats
        </TabsTrigger>
        <TabsTrigger value="Groups" className="tab-element--chat-room">
          Groups
        </TabsTrigger>
        <TabsTrigger
          value="Persons"
          className="tab-element--chat-room font-bold"
        >
          Persons
        </TabsTrigger>
        <TabsTrigger
          value="Current"
          className="tab-element--chat-room font-bold"
        >
          Current
        </TabsTrigger>
      </TabsList>
      <TabsContent value="All Chats" className="chats-container--chat-room">
        <div className="chats-section--chat-room scrollbar-custom p-3 ">
          <p className="tabs-type--chat-room chats-background--chat-room font-bold">
            Groups
          </p>
          <ScrollArea>
            <div className="chats-background--chat-room">
              {groups.map((group, index) => (
                <div key={group.id} className="chats-background--chat-room">
                  <ChatItem chat={group} />
                  {index < groups.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="chats-section--chat-room scrollbar-custom p-4">
          <p className="tabs-type--chat-room chats-background--chat-room font-bold">
            Persons
          </p>
          <ScrollArea>
            <div className="chats-background--chat-room">
              {persons.map((person, index) => (
                <div key={person.id} className="chats-background--chat-room">
                  <ChatItem chat={person} />
                  {index < persons.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
      <TabsContent value="Groups" className="chats-container--chat-room">
        <div className="chats-section--chat-room scrollbar-custom p-3">
          <p className="tabs-type--chat-room chats-background--chat-room font-bold">
            Groups
          </p>
          <ScrollArea>
            <div className="chats-background--chat-room">
              {groups.map((group, index) => (
                <div key={group.id} className="chats-background--chat-room">
                  <ChatItem chat={group} />
                  {index < groups.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
      <TabsContent value="Persons" className="chats-container--chat-room">
        <div className="chats-section--chat-room scrollbar-custom p-3">
          <p className="tabs-type--chat-room chats-background--chat-room font-bold">
            Persons
          </p>
          <ScrollArea>
            <div className="chats-background--chat-room">
              {persons.map((person, index) => (
                <div key={person.id} className="chats-background--chat-room">
                  <ChatItem chat={person} />
                  {index < persons.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
      <TabsContent value="Current" className="chats-container--chat-room">
        <div className="chats-section--chat-room scrollbar-custom p-3">
          <p className="tabs-type--chat-room chats-background--chat-room font-bold">
            Current
          </p>
          <ScrollArea>
            <div className="chats-background--chat-room">
              {users.map((user, index) => (
                <div
                  key={user.userID}
                  className="chat-item flex items-center space-x-4 p-2 chats-background--chat-room"
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt={user.userID}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 chats-background--chat-room">
                    <div className="flex justify-between items-center chats-background--chat-room">
                      <span className="font-semibold chats-background--chat-room">
                        {user.userID}
                      </span>
                      <span className="text-xs text-gray-500 chats-background--chat-room">
                        3:51
                      </span>
                    </div>
                    <div className="flex items-center chats-background--chat-room">
                      <div className="flex items-center user-state--chat-room">
                        <div
                          className="circle-state--chat-room"
                          style={{
                            backgroundColor: user.isOnline ? "green" : "red",
                          }}
                        ></div>
                        <span className="chats-background--chat-room text-sm">
                          {user.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
    </Tabs>
  );
}
