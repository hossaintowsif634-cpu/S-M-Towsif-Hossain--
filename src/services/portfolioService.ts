import { supabase } from '../lib/supabase';

export const portfolioService = {
  async getPortfolioData() {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching portfolio data:', error);
      return null;
    }
    return data.content;
  },

  async savePortfolioData(content: any) {
    if (!supabase) {
      console.warn('Supabase client not initialized. Data saved locally only.');
      return;
    }

    const { error } = await supabase
      .from('portfolio')
      .upsert({ id: 1, content, updated_at: new Date() });
    
    if (error) {
      console.error('Error saving portfolio data:', error);
      throw error;
    }
  },

  async getMessages() {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data;
  },

  async saveMessage(message: { name: string, email: string, subject: string, message: string }) {
    if (!supabase) {
      console.warn('Supabase client not initialized. Message not saved to database.');
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert([message]);

    if (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }
};
