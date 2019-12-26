class StatsController < ApplicationController
    def index
        @stats = Stat.all
        render json: @stats, status: 200 
    end 

    def show
        @stat = Stat.find(params[:id])
        render json: @stat, status: 200
    end 

    def create
        #binding.pry
        #same here later change to Stat.new, following if statement with applied conventions
        @stat = Stat.create(stat_params)
        render json: @stat, status: 200
    end 

    def update
        #should add back in usual conventions if @stat.update (works), then update etc, if not then error or return to previous process, etc refer to previous rails apps
        @stat = Stat.find(params[:id])
        @stat.update(stat_params)
        render json: @stat, status: 200
    end 
    
    def destroy
        @stat = Stat.find(params[:id])
        @stat.delete
        render json: {statId: @stat.id} #do not want to pass back all info, just the reference to what was deleted
    end
    private
        def stat_params
            params.require(:stat).permit([:score, :hit, :created_at, :updated_at]) #for now
        end 
end
