import { supabase } from '../lib/supabase';

class AuthStore {
  constructor() {
    this.user = null;
    this.profile = null;
    this.listeners = [];
  }

  async init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      this.user = session.user;
      await this.loadProfile();
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        this.user = session.user;
        await this.loadProfile();
      } else {
        this.user = null;
        this.profile = null;
      }
      this.notify();
    });
  }

  async loadProfile() {
    if (!this.user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', this.user.id)
      .maybeSingle();

    if (data) {
      this.profile = data;
    }
  }

  async signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          username,
        });

      if (profileError) throw profileError;
    }

    return data;
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async updateProfile(updates) {
    if (!this.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', this.user.id);

    if (error) throw error;
    await this.loadProfile();
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  isAuthenticated() {
    return !!this.user;
  }
}

export const authStore = new AuthStore();
