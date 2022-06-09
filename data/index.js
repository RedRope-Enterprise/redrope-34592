import inviteUsers from "./raw/inviteUsers"
import events from "./raw/events"

class DataProvider {
  getInviteUsers() {
    return inviteUsers
  }
  getEvents() {
    return events
  }
}

export const data = new DataProvider()
