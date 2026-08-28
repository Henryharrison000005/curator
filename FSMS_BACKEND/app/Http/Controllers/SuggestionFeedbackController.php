<?php

namespace App\Http\Controllers;

use App\Models\SuggestionFeedback;
use App\Http\Requests\StoreSuggestionFeedbackRequest;
use App\Http\Requests\UpdateSuggestionFeedbackRequest;

class SuggestionFeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSuggestionFeedbackRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SuggestionFeedback $suggestionFeedback)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SuggestionFeedback $suggestionFeedback)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSuggestionFeedbackRequest $request, SuggestionFeedback $suggestionFeedback)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SuggestionFeedback $suggestionFeedback)
    {
        //
    }
}
