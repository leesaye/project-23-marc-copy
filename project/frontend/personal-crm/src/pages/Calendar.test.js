import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CalendarPage from './Calendar';
import '@testing-library/jest-dom';

jest.mock('axios');

describe('CalendarPage Component', () => {
    const mockEvents = [{ id: 1, title: 'Event 1', start: '2024-06-01T10:00:00Z', end: '2024-06-01T12:00:00Z', color: '#FF0000' }];
    const mockTasks = [{ id: 1, title: 'Task 1', date: '2024-06-02', color: '#00FF00' }];
    
    beforeEach(() => {
        axios.get.mockResolvedValueOnce({ data: mockEvents })
                .mockResolvedValueOnce({ data: mockTasks });
    });

    test('renders calendar with events and tasks', async () => {
        render(<CalendarPage />);
        expect(screen.getByText('Tasks')).toBeInTheDocument();
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
        expect(screen.getByText('Event 1')).toBeInTheDocument();
        expect(screen.getByText('Task: Task 1')).toBeInTheDocument();
    });

    test('shows event form modal', () => {
        render(<CalendarPage />);
        fireEvent.click(screen.getByText('+ Add Event'));
        expect(screen.getByText('Add Event')).toBeInTheDocument();
    });

    test('shows task form modal', () => {
        render(<CalendarPage />);
        fireEvent.click(screen.getByText('+ Add Task'));
        expect(screen.getByText('Add Task')).toBeInTheDocument();
    });

    test('adds new event', async () => {
        render(<CalendarPage />);
        fireEvent.click(screen.getByText('+ Add Event'));
        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'New Event' } });
        fireEvent.change(screen.getByLabelText('Start Time:'), { target: { value: '2024-06-03T10:00' } });
        fireEvent.change(screen.getByLabelText('End Time:'), { target: { value: '2024-06-03T12:00' } });
        axios.post.mockResolvedValueOnce({ data: { id: 2, title: 'New Event', start: '2024-06-03T10:00:00Z', end: '2024-06-03T12:00:00Z', color: '#0000FF' } });
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => expect(screen.getByText('New Event')).toBeInTheDocument());
    });

    test('adds new task', async () => {
        render(<CalendarPage />);
        fireEvent.click(screen.getByText('+ Add Task'));
        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'New Task' } });
        fireEvent.change(screen.getByLabelText('Date:'), { target: { value: '2024-06-04' } });
        axios.post.mockResolvedValueOnce({ data: { id: 2, title: 'New Task', date: '2024-06-04', color: '#0000FF' } });
        fireEvent.click(screen.getByText('Save'));
        await waitFor(() => expect(screen.getByText('Task: New Task')).toBeInTheDocument());
    });

    test('ensures event colors apply correctly', async () => {
        render(<CalendarPage />);
        await waitFor(() => expect(screen.getByText('Event 1')).toBeInTheDocument());
        expect(screen.getByText('Event 1')).toHaveStyle('background-color: #FF0000');
    });
});
