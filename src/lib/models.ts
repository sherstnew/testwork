import mongoose, { Schema, Types } from 'mongoose';

export interface IExamModel extends mongoose.Document {
  name: string;
  questions: Types.ObjectId[];
  results: Types.ObjectId[];
  questionsLimit: number;
  availableTime: number;
}

export const QuestionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

export const ResultSchema = new Schema({
  name: { type: String, required: true },
  result: { type: Number, required: true },
  time: { type: Number, required: true },
}, { timestamps: true });

export const ExamSchema = new Schema({
  name: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  results: [{ type: Schema.Types.ObjectId, ref: 'Result' }],
  questionsLimit: { type: Number, required: true },
  availableTime: { type: Number, required: true },
});

export const IncorrectSchema = new Schema({
  text: { type: String, required: true },
  given: { type: String, required: true },
  correct: { type: String, required: true },
}, { _id: false });

export const SessionSchema = new Schema({
  name: { type: String, required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
  expiredAt: { type: Date, required: true },
  startedAt: { type: Date },
  endsAt: { type: Date },
  questions: [QuestionSchema],
  result: { type: Number, default: 0 },
  initialLength: { type: Number },
  incorrects: { type: [IncorrectSchema], default: [] },
  selectedAnswer: { type: String, default: '' },
});

export const ExamModel = mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
export const QuestionModel = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
export const ResultModel = mongoose.models.Result || mongoose.model('Result', ResultSchema);
export const SessionModel = mongoose.models.Session || mongoose.model('Session', SessionSchema);
