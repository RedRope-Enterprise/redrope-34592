import inviteUsers from "./raw/inviteUsers"
import events from "./raw/events"
import eventCategory from "./raw/eventCategory"

class DataProvider {
  getInviteUsers() {
    return inviteUsers
  }
  getEvents() {
    return events
  }

  getEventCategories(){
    return eventCategory
  }
}

export const data = new DataProvider()
