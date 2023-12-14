import Feedback from "../../models/feedbackModel";
export default {
    findAll() {
        return Feedback.find();
    },
    findById(id) {
        return Feedback.findById(id);
    }
};
