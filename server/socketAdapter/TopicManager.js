/**
 * A platform unspecific manager for topics which allows subscribing
 * and publishing to a topic
 */
class _TopicManager {
    constructor () {
        this.topics = new Map();
        this.users = new Map();
    }

    subscribe (ws, topic) {
        let topicUsers = this.topics.get(topic);
        if (topicUsers === undefined) {
            topicUsers = new Map();
            this.topics.set(topic, topicUsers);
        }
        topicUsers.set(ws.id, ws);

        let userTopics = this.users.get(ws.id);
        if (userTopics === undefined) {
            userTopics = new Map();
            this.users.set(ws.id, userTopics);
        }
        userTopics.set(topic, topicUsers);
    }

    unsubscribe (ws, topic) {
        const userTopics = this.users.get(ws.id);
        if (userTopics) {
            const topicUsers = userTopics.get(topic);
            topicUsers.delete(ws.id);
            userTopics.delete(topic);
        }
    }

    unsubscribeAll (ws) {
        const userTopics = this.users.get(ws.id);
        if (userTopics) {
            userTopics.forEach((topicUsers, topic) => {
                topicUsers.delete(ws.id);
            });
            this.users.delete(ws.id);
        }
    }

    publish (topic, message) {
        const topicUsers = this.topics.get(topic);
        if (topicUsers) {
            topicUsers.forEach((ws, id) => {
                ws.send(message);
            });
        }
    }
}

export const TopicManager = new _TopicManager();
