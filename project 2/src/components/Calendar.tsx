import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Plus, ChevronLeft, ChevronRight, Filter, Users, MapPin, Clock, Briefcase, Phone, Calendar as CalendarIcon, UserCheck, FileText, DollarSign, Download } from 'lucide-react';
import { CalendarEvent, Job, Customer } from '../utils/types';
import EnhancedTaskForm from './EnhancedTaskForm';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarProps {
  events: CalendarEvent[];
  jobs: Job[];
  customers: Customer[];
  teamMembers: { id: string; name: string; color: string }[];
  onNewEvent: () => void;
  onNewTask: () => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onSaveNewCalendarEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdateJobDates: (jobId: string, startDate: Date, endDate: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  jobs,
  customers,
  teamMembers,
  onNewEvent,
  onNewTask,
  onEventClick,
  onEventUpdate,
  onSaveNewCalendarEvent,
  onUpdateJobDates
}) => {
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [showTaskTypeMenu, setShowTaskTypeMenu] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<CalendarEvent['type'] | null>(null);

  const taskTypes = [
    { id: 'task', label: 'Add Task', icon: Clock },
    { id: 'phone_call', label: 'Phone Call', icon: Phone },
    { id: 'appointment', label: 'Appointment', icon: CalendarIcon },
    { id: 'lead_followup', label: 'Lead Follow Up', icon: UserCheck },
    { id: 'invoice_followup', label: 'Invoice Follow Up', icon: FileText },
    { id: 'estimate_followup', label: 'Estimate Follow Up', icon: DollarSign }
  ];

  const handleTaskTypeSelect = (type: CalendarEvent['type']) => {
    setSelectedTaskType(type);
    setIsTaskFormOpen(true);
    setShowTaskTypeMenu(false);
  };

  const handleExportToPDF = () => {
    // PDF export logic would go here
    console.log('Exporting calendar to PDF');
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3B82F6';
    
    switch (event.type) {
      case 'task':
        backgroundColor = '#10B981';
        break;
      case 'appointment':
        backgroundColor = '#3B82F6';
        break;
      case 'phone_call':
        backgroundColor = '#F59E0B';
        break;
      case 'lead_followup':
        backgroundColor = '#8B5CF6';
        break;
      case 'invoice_followup':
        backgroundColor = '#EC4899';
        break;
      case 'estimate_followup':
        backgroundColor = '#06B6D4';
        break;
    }

    if (event.status === 'completed') {
      backgroundColor = '#6B7280';
    } else if (event.status === 'cancelled') {
      backgroundColor = '#EF4444';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: any) => {
    setView(newView);
  };

  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          
          <button 
            onClick={handleExportToPDF}
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 rounded-lg transition-colors text-sm"
          >
            <Download className="w-3 h-3" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white min-w-[180px] text-center">
            {label}
          </h2>
          
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          {['Day', 'Week', 'Month', 'Agenda'].map((viewName) => (
            <button
              key={viewName}
              onClick={() => onView(viewName.toLowerCase())}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                view === viewName.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {viewName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex space-x-6">
      {/* Left Sidebar */}
      <div className="w-80 space-y-6">
        {/* Add Task Button */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="relative">
            <button
              onClick={() => setShowTaskTypeMenu(!showTaskTypeMenu)}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add</span>
            </button>
            
            {showTaskTypeMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 min-w-max">
                {taskTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTaskTypeSelect(type.id as CalendarEvent['type'])}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl text-sm whitespace-nowrap"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Members</span>
          </h3>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: member.color }}
                />
                <span className="text-gray-900 dark:text-white text-sm">{member.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 space-y-6">
      {/* Team Members Filter */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <label key={member.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTeamMembers.includes(member.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTeamMembers([...selectedTeamMembers, member.id]);
                    } else {
                      setSelectedTeamMembers(selectedTeamMembers.filter(id => id !== member.id));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: member.color }}
                  />
                  <span className="text-gray-900 dark:text-white">{member.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={onEventClick}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        />
      </div>
      
      <EnhancedTaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        jobs={jobs}
        customers={customers}
        taskType={selectedTaskType}
        teamMembers={teamMembers}
        onSave={(taskData) => {
          onSaveNewCalendarEvent(taskData);
          setIsTaskFormOpen(false);
          setSelectedTaskType(null);
        }}
      />
      </div>
    </div>
  );
};

export default Calendar;