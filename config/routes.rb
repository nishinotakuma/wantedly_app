Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'users#index'
  resources :users
  resources :skills
  get 'users/:id/get_skills', to: 'users#get_skills'
  get 'users/:id/get_other_skills', to: 'users#get_other_skills'
  get 'users/:id/get_skills_suggestion', to: 'users#get_skills_suggestion'
  post 'users/:id/update_skills', to: 'users#update_skills'
  post 'users/:id/update_count_skills', to: 'users#update_count_skills'
end
