import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { store } from './server/store.ts';
import {
  analyzeHackathonSubmission,
  getCoachChatResponse,
  evaluateStudentReadiness
} from './server/gemini.ts';
import {
  Hackathon,
  Course,
  HackathonSubmission,
  SavedHackathonReview,
  LearningRoadmap
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '15mb' }));

  // ==================== API ROUTES ====================

  // 1. Hackathons API
  app.get('/api/hackathons', (req, res) => {
    try {
      const hackathons = store.getHackathons();
      res.json(hackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      res.status(500).json({ error: 'Failed to fetch hackathons' });
    }
  });

  app.get('/api/hackathons/:id', (req, res) => {
    try {
      const hackathon = store.getHackathonById(req.params.id);
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      res.json(hackathon);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hackathon' });
    }
  });

  app.post('/api/hackathons', (req, res) => {
    try {
      const newHackathon: Hackathon = {
        ...req.body,
        id: req.body.id || `hack-${Date.now()}`,
        lastVerified: req.body.lastVerified || new Date().toISOString().split('T')[0]
      };
      const created = store.addHackathon(newHackathon);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create hackathon' });
    }
  });

  app.put('/api/hackathons/:id', (req, res) => {
    try {
      const updated = store.updateHackathon(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update hackathon' });
    }
  });

  app.delete('/api/hackathons/:id', (req, res) => {
    try {
      const deleted = store.deleteHackathon(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      res.json({ success: true, message: 'Hackathon deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete hackathon' });
    }
  });

  // 2. Courses API
  app.get('/api/courses', (req, res) => {
    try {
      const courses = store.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  app.get('/api/courses/:id', (req, res) => {
    try {
      const course = store.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  });

  app.post('/api/courses', (req, res) => {
    try {
      const newCourse: Course = {
        ...req.body,
        id: req.body.id || `course-${Date.now()}`,
        lastVerified: req.body.lastVerified || new Date().toISOString().split('T')[0]
      };
      const created = store.addCourse(newCourse);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create course' });
    }
  });

  app.put('/api/courses/:id', (req, res) => {
    try {
      const updated = store.updateCourse(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update course' });
    }
  });

  app.delete('/api/courses/:id', (req, res) => {
    try {
      const deleted = store.deleteCourse(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  });

  // 3. User & Dashboard API
  app.get('/api/user', (req, res) => {
    try {
      const user = store.getUser();
      const applications = store.getApplications();
      const trackedCourses = store.getTrackedCourses();
      const roadmaps = store.getRoadmaps();
      const reviews = store.getReviews();
      const notifications = store.getNotifications();

      res.json({
        user,
        applications,
        trackedCourses,
        roadmaps,
        reviews,
        notifications
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });

  app.put('/api/user', (req, res) => {
    try {
      const updated = store.updateUser(req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  });

  app.post('/api/user/applications', (req, res) => {
    try {
      const { hackathonId, status, notes, teamName } = req.body;
      if (!hackathonId || !status) {
        return res.status(400).json({ error: 'Missing hackathonId or status' });
      }
      const updated = store.setApplicationStatus(hackathonId, status, notes, teamName);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update application' });
    }
  });

  app.delete('/api/user/applications/:hackathonId', (req, res) => {
    try {
      store.removeApplication(req.params.hackathonId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove application' });
    }
  });

  app.post('/api/user/courses', (req, res) => {
    try {
      const { courseId, status, progressPercent, notes, certificateUrl } = req.body;
      if (!courseId || !status) {
        return res.status(400).json({ error: 'Missing courseId or status' });
      }
      const updated = store.setCourseProgress(courseId, status, progressPercent, notes, certificateUrl);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to track course' });
    }
  });

  app.delete('/api/user/courses/:courseId', (req, res) => {
    try {
      store.removeTrackedCourse(req.params.courseId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to untrack course' });
    }
  });

  app.post('/api/user/roadmaps', (req, res) => {
    try {
      const roadmap: LearningRoadmap = {
        ...req.body,
        id: req.body.id || `rdmp-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const created = store.addRoadmap(roadmap);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save roadmap' });
    }
  });

  app.put('/api/user/roadmaps/:id/step', (req, res) => {
    try {
      const { stepId, completed } = req.body;
      const updated = store.updateRoadmapStep(req.params.id, stepId, completed);
      if (!updated) {
        return res.status(404).json({ error: 'Roadmap or step not found' });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update step' });
    }
  });

  app.delete('/api/user/roadmaps/:id', (req, res) => {
    try {
      store.deleteRoadmap(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete roadmap' });
    }
  });

  app.post('/api/user/notifications/:id/read', (req, res) => {
    try {
      store.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark notification read' });
    }
  });

  // 4. AI Hackathon Coach & Gemini Endpoints
  app.post('/api/gemini/analyze-hackathon', async (req, res) => {
    try {
      const submission: HackathonSubmission = req.body;
      if (!submission.hackathonName) {
        return res.status(400).json({ error: 'Hackathon name is required' });
      }

      const feedback = await analyzeHackathonSubmission(submission);

      // Save review to student's history
      const savedReview: SavedHackathonReview = {
        id: `rev-${Date.now()}`,
        date: new Date().toISOString(),
        hackathonName: submission.hackathonName,
        submission,
        feedback,
        chatMessages: [
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `I've completed my 10-dimension evaluation of **${submission.hackathonName}**. Review the scorecard, strengths, and prioritized areas above. What questions do you have about this analysis or your next steps?`,
            timestamp: new Date().toISOString()
          }
        ]
      };

      store.addReview(savedReview);

      res.json({
        reviewId: savedReview.id,
        feedback,
        chatMessages: savedReview.chatMessages
      });
    } catch (error) {
      console.error('Error during hackathon analysis:', error);
      res.status(500).json({ error: 'Failed to complete AI Coach analysis' });
    }
  });

  app.post('/api/gemini/coach-chat', async (req, res) => {
    try {
      const { reviewId, message } = req.body;
      if (!reviewId || !message) {
        return res.status(400).json({ error: 'Missing reviewId or message' });
      }

      const reviews = store.getReviews();
      const review = reviews.find(r => r.id === reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Add user message to history
      const userMsg = {
        id: `usr-${Date.now()}`,
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      };
      store.appendChatMessage(reviewId, userMsg);

      // Generate response
      const answer = await getCoachChatResponse(
        review.submission,
        review.feedback,
        review.chatMessages || [],
        message
      );

      const assistantMsg = {
        id: `asst-${Date.now()}`,
        role: 'assistant' as const,
        content: answer,
        timestamp: new Date().toISOString()
      };
      store.appendChatMessage(reviewId, assistantMsg);

      res.json({ message: assistantMsg });
    } catch (error) {
      console.error('Error in coach chat:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

  app.post('/api/gemini/readiness-check', async (req, res) => {
    try {
      const { hackathonId } = req.body;
      const hackathon = store.getHackathonById(hackathonId);
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      const user = store.getUser();
      const readiness = await evaluateStudentReadiness(hackathon, user);
      res.json(readiness);
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate readiness' });
    }
  });

  // Admin reset demo data
  app.post('/api/admin/reset', (req, res) => {
    try {
      store.resetToDefault();
      res.json({ success: true, message: 'Data reset to defaults' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset data' });
    }
  });

  // ==================== VITE / STATIC SERVING ====================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Opportunity Atlas full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
