import Feedback from "../../models/feedbackModel.js";
export default {
    findAll() {
        return Feedback.find();
    },
    findById(id) {
        return Feedback.findById(id);
    },
    add(enity) {
        Feedback.add(enity);
    }
};
