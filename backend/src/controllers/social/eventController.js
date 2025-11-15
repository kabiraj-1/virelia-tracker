const Event = require('../../models/social/Event');
const Karma = require('../../models/social/Karma');

class EventController {
  async createEvent(req, res) {
    try {
      const event = new Event({
        ...req.body,
        creator: req.user.id
      });
      await event.save();
      
      // Award karma for event creation
      const karma = new Karma({
        userId: req.user.id,
        points: 25,
        reason: 'Event Creation',
        type: 'event_creation'
      });
      await karma.save();
      
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getEvents(req, res) {
    try {
      const events = await Event.find()
        .populate('creator', 'name email')
        .populate('participants', 'name email')
        .sort({ createdAt: -1 });
      res.json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async joinEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      if (event.participants.includes(req.user.id)) {
        return res.status(400).json({ success: false, message: 'Already joined' });
      }

      event.participants.push(req.user.id);
      await event.save();

      // Award karma for participation
      const karma = new Karma({
        userId: req.user.id,
        points: 10,
        reason: 'Event Participation',
        type: 'event_participation'
      });
      await karma.save();

      res.json({ success: true, data: event });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new EventController();
